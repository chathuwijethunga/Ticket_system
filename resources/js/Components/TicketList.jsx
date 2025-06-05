import React, { useState, useEffect } from 'react';

function TicketList({ initialTickets, successMessage, errorMessage }) {
    // State to manage the list of tickets shown in the UI
    const [tickets, setTickets] = useState(initialTickets || []);
    // State for managing loading status during delete operations
    const [deletingId, setDeletingId] = useState(null);
    // State for managing flash messages within React
    const [flashMessage, setFlashMessage] = useState(null);
    const [flashType, setFlashType] = useState(null);

    // Effect to display success/error messages passed from Laravel Blade
    useEffect(() => {
        if (successMessage) {
            setFlashMessage(successMessage);
            setFlashType('success');
        } else if (errorMessage) {
            setFlashMessage(errorMessage);
            setFlashType('error');
        }
        // Clear message after some time (optional, but good for user experience)
        const timer = setTimeout(() => {
            setFlashMessage(null);
            setFlashType(null);
        }, 5000); // Message disappears after 5 seconds
        return () => clearTimeout(timer); // Cleanup timer
    }, [successMessage, errorMessage]); // Re-run if these props change

    // Function to handle ticket deletion
    const handleDelete = async (id, csrfToken) => {
        if (!confirm('Are you sure you want to delete this ticket?')) {
            return; // User cancelled
        }

        setDeletingId(id); // Set loading state for the specific ticket

        try {
            // Perform a POST request to the Laravel delete route, spoofing DELETE method
            const response = await fetch(`/tickets/${id}`, {
                method: 'POST', // HTML forms only support GET/POST, so we spoof DELETE
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken, // Important for Laravel's CSRF protection
                },
                body: JSON.stringify({ _method: 'DELETE' }), // Spoof DELETE method
            });

            if (response.ok) {
                // If deletion was successful, remove the ticket from the local state
                setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== id));
                setFlashMessage('Ticket deleted successfully!');
                setFlashType('success');
            } else {
                // Handle HTTP errors
                const errorText = await response.text();
                setFlashMessage(`Error deleting ticket: ${errorText}`);
                setFlashType('error');
            }
        } catch (error) {
            // Handle network errors
            setFlashMessage(`Network error: ${error.message}`);
            setFlashType('error');
        } finally {
            setDeletingId(null); // Clear loading state
            // Clear message after some time
            const timer = setTimeout(() => {
                setFlashMessage(null);
                setFlashType(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    };

    // Function to truncate text (similar to Laravel's Str::limit)
    const truncateText = (text, limit) => {
        if (!text) return '';
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    };

    // Get CSRF Token from meta tag (Laravel's default approach)
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');


    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">All Tickets</h1>
                <a href="/tickets/create" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Create New Ticket
                </a>
            </div>

            {/* React-managed Flash Messages */}
            {flashMessage && (
                <div className={`bg-<span class="math-inline">\{flashType \=\=\= 'success' ? 'green' \: 'red'\}\-100 border border\-</span>{flashType === 'success' ? 'green' : 'red'}-400 text-${flashType === 'success' ? 'green' : 'red'}-700 px-4 py-3 rounded relative mb-4`} role="alert">
                    <strong className="font-bold">{flashType === 'success' ? 'Success!' : 'Error!'}</strong>
                    <span className="block sm:inline"> {flashMessage}</span>
                </div>
            )}


            {/* Status Filters - HTML Form Submission for Server-Side Filtering */}
            <form action="/tickets" method="GET" className="mb-4 flex items-center space-x-2">
                <label htmlFor="status-filter" className="text-gray-700 font-bold text-sm">Filter by Status:</label>
                <select
                    name="status"
                    id="status-filter"
                    onChange={(e) => e.target.form.submit()} // Submit form when selection changes
                    value={new URLSearchParams(window.location.search).get('status') || ''}
                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">All</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>
            </form>

            {/* Display total open and closed tickets */}
            <div className="mb-4 text-gray-700">
                Total Open Tickets: <span className="font-semibold">{tickets.filter(t => t.status === 'open').length}</span> |
                Total Closed Tickets: <span className="font-semibold">{tickets.filter(t => t.status === 'closed').length}</span>
            </div>

            {tickets.length === 0 ? (
                <p className="text-gray-600">No tickets found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">ID</th>
                                <th className="py-3 px-6 text-left">Customer Name</th>
                                <th className="py-3 px-6 text-left">Issue Description</th>
                                <th className="py-3 px-6 text-left">Priority</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-left">Last Update</th> {/* New column */}
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {tickets.map(ticket => (
                                <tr key={ticket.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{ticket.id}</td>
                                    <td className="py-3 px-6 text-left">{ticket.customer_name}</td>
                                    <td className="py-3 px-6 text-left">{truncateText(ticket.issue_description, 50)}</td>
                                    <td className="py-3 px-6 text-left">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            ticket.priority === 'high' ? 'bg-red-200 text-red-800' :
                                            ticket.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                            'bg-green-200 text-green-800'
                                        }`}>
                                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            ticket.status === 'open' ? 'bg-blue-200 text-blue-800' :
                                            'bg-gray-200 text-gray-800'
                                        }`}>
                                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                        {new Date(ticket.updated_at).toLocaleString()}
                                    </td> {/* Display last update */}
                                    <td className="py-3 px-6 text-center">
                                        <div className="flex item-center justify-center">
                                            <a href={`/tickets/${ticket.id}/edit`} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </a>
                                            <button
                                                onClick={() => handleDelete(ticket.id, csrfToken)}
                                                className="w-4 mr-2 transform hover:text-red-500 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={deletingId === ticket.id} // Disable button during deletion
                                            >
                                                {deletingId === ticket.id ? (
                                                    // Simple loading indicator using SVG spin
                                                    <svg className="animate-spin h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default TicketList;