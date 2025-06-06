import React, { useState, useEffect } from 'react';

function TicketList() {
    // Get initial data from the DOM element (passed by Blade)
    const ticketListElement = document.getElementById('ticket-list-root');
    const initialTickets = JSON.parse(ticketListElement.dataset.tickets || '[]');

    const [tickets, setTickets] = useState(initialTickets);
    const [filterStatus, setFilterStatus] = useState('all'); // State for dropdown filter
    const [flashMessage, setFlashMessage] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false); // For filtering/form submissions

    // Effect to check for flash messages from Laravel on component mount
    // (Only if you intend to display them via React. Laravel flash messages are typically consumed by Blade once)
    // For this task, it's simpler to show them directly in Blade, as shown above in index.blade.php
    // But if you wanted React to consume them, you'd need a way to pass them, e.g., via a data attribute
    // on the root element, similar to how tickets are passed.

    useEffect(() => {
        // Example of accessing potential flash messages if passed via data attribute
        // const flashElement = document.getElementById('flash-messages'); // Assuming you had such an element
        // if (flashElement && flashElement.dataset.success) {
        //     setFlashMessage({ type: 'success', message: flashElement.dataset.success });
        // } else if (flashElement && flashElement.dataset.error) {
        //     setFlashMessage({ type: 'error', message: flashElement.dataset.error });
        // }
    }, []);


    const handleFilterChange = (e) => {
        const newStatus = e.target.value;
        setFilterStatus(newStatus); // Update local state

        // Simulate form submission to Laravel for filtering
        // This will reload the entire Blade view with filtered data
        // A more "React-y" way would be to fetch data via AJAX, but the task specifies form submission.
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = '/tickets'; // Laravel route for index
        if (newStatus !== 'all') {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'status';
            input.value = newStatus;
            form.appendChild(input);
        }
        document.body.appendChild(form);
        form.submit();
    };

    const handleDelete = (ticketId) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            setLoading(true);
            // Create a form programmatically for DELETE request
            const form = document.createElement('form');
            form.method = 'POST'; // HTML forms only support GET/POST, so we'll spoof DELETE
            form.action = `/tickets/${ticketId}`;

            const methodInput = document.createElement('input');
            methodInput.type = 'hidden';
            methodInput.name = '_method';
            methodInput.value = 'DELETE';
            form.appendChild(methodInput);

            // Get CSRF token from a meta tag or a global JS variable if available
            // For this scenario, it's typically best to get it from the existing form (create/edit) or a meta tag.
            // Let's assume you've added a meta tag in your main layout:
            // <meta name="csrf-token" content="{{ csrf_token() }}">
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = '_token';
            tokenInput.value = csrfToken;
            form.appendChild(tokenInput);

            document.body.appendChild(form);
            form.submit(); // This will trigger a full page reload and Laravel's flash messages
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">Ticket List</h2>
                <div className="flex items-center">
                    <label htmlFor="statusFilter" className="mr-2 text-gray-600">Filter by Status:</label>
                    <select
                        id="statusFilter"
                        className="border rounded px-3 py-1"
                        value={filterStatus}
                        onChange={handleFilterChange}
                        disabled={loading} // Disable during loading
                    >
                        <option value="all">All</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>

            {loading && (
                <div className="text-center text-blue-500 py-4">Loading...</div>
            )}

            {!loading && tickets.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No tickets found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Customer Name</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Issue Description</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Priority</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Status</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{ticket.customer_name}</td>
                                    <td className="py-2 px-4 border-b">{ticket.issue_description.substring(0, 50)}...</td>
                                    <td className="py-2 px-4 border-b capitalize">{ticket.priority}</td>
                                    <td className="py-2 px-4 border-b capitalize">{ticket.status}</td>
                                    <td className="py-2 px-4 border-b">
                                        <a href={`/tickets/${ticket.id}/edit`} className="text-blue-500 hover:underline mr-2">Edit</a>
                                        <button
                                            onClick={() => handleDelete(ticket.id)}
                                            className="text-red-500 hover:underline"
                                            disabled={loading}
                                        >
                                            Delete
                                        </button>
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