import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

function TicketList() {
    const ticketListElement = document.getElementById('ticket-list-root');
    const initialStatusFromBlade = ticketListElement.dataset.filterStatus || 'all';

    const [tickets, setTickets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [actualSearchTerm, setActualSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(initialStatusFromBlade);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openTicketsCount, setOpenTicketsCount] = useState(0);
    const [closedTicketsCount, setClosedTicketsCount] = useState(0);

    const fetchTickets = async (currentActualSearchTerm, currentFilterStatus) => {
        setLoading(true);
        setError(null);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            const queryParams = new URLSearchParams();
            if (currentActualSearchTerm) {
                queryParams.append('search', currentActualSearchTerm);
            }
            if (currentFilterStatus !== 'all') {
                queryParams.append('status', currentFilterStatus);
            }

            const response = await fetch(`/tickets?${queryParams.toString()}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data received by React:", data);
            setTickets(data.tickets);
            setOpenTicketsCount(data.counts.open);
            setClosedTicketsCount(data.counts.closed);

        } catch (err) {
            console.error("Error fetching tickets:", err);
            setError(err.message || 'An unexpected error occurred during fetching.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets(actualSearchTerm, filterStatus);
    }, [actualSearchTerm, filterStatus]);

    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = () => {
        setActualSearchTerm(searchQuery);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setActualSearchTerm('');
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleDelete = async (ticketId) => {
        if (!window.confirm('Are you sure you want to delete this ticket?')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            const response = await fetch(`/tickets/${ticketId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to delete ticket (Status: ${response.status})`);
            }

            await fetchTickets(actualSearchTerm, filterStatus);

        } catch (err) {
            console.error("Error deleting ticket:", err);
            setError(err.message || 'An unexpected error occurred during deletion.');
        } finally {
            setLoading(false);
        }
    };

    const getPriorityClasses = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-red-200 text-red-800';
            case 'medium':
                return 'bg-yellow-200 text-yellow-800';
            case 'low':
                return 'bg-green-200 text-green-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            {/* Ticket Summary Section */}
            <div className="flex justify-around items-center mb-6 p-3 bg-gray-100 rounded-lg shadow-inner">
                <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">Open Tickets</p> {/* Reduced to text-sm */}
                    <p className="text-2xl font-bold text-blue-600">{openTicketsCount}</p> {/* Reduced to text-2xl */}
                </div>
                <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">Closed Tickets</p> {/* Reduced to text-sm */}
                    <p className="text-2xl font-bold text-green-600">{closedTicketsCount}</p> {/* Reduced to text-2xl */}
                </div>
            </div>

            {/* Search and Filter UI */}
            <div className="flex justify-between items-center mb-4">
                {/* Search Input and Button */}
                <div className="flex-grow flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Search by customer or issue..."
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        disabled={loading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearchSubmit();
                            }
                        }}
                    />
                    <button
                        onClick={handleSearchSubmit}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        disabled={loading}
                    >
                        Search
                    </button>
                    {actualSearchTerm && (
                        <button onClick={handleClearSearch} className="text-gray-500 hover:text-gray-700 font-bold py-2 px-4 rounded" disabled={loading}>
                            Clear Search
                        </button>
                    )}
                </div>

                {/* Status Filter */}
                <div className="ml-4 flex items-center space-x-2">
                    <label htmlFor="statusFilter" className="mr-2 text-gray-600">Filter by Status:</label>
                    <select
                        id="statusFilter"
                        className="border rounded px-3 py-1"
                        value={filterStatus}
                        onChange={handleFilterChange}
                        disabled={loading}
                    >
                        <option value="all">All</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>

            {/* Displaying Loading/Error/No Tickets */}
            {loading && (
                <div className="text-center text-blue-500 py-4">Loading tickets...</div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            {!loading && !error && tickets.length === 0 && (
                <p className="text-gray-600 text-center py-4">No tickets found.</p>
            )}

            {/* Ticket List Display */}
            {!loading && !error && tickets.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Customer Name</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Issue Description</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Priority</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Status</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Last Updated</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{ticket.customer_name}</td>
                                    <td className="py-2 px-4 border-b">{ticket.issue_description.substring(0, 50)}...</td>
                                    <td className="py-2 px-4 border-b">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityClasses(ticket.priority)} capitalize`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b capitalize">{ticket.status}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-600">
                                        {formatTimestamp(ticket.updated_at)}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <a href={`/tickets/${ticket.id}/edit`} className="text-blue-500 hover:text-blue-700 mr-2 inline-flex items-center">
                                            <Pencil className="w-4 h-4" />
                                            <span className="sr-only">Edit</span>
                                        </a>
                                        <button
                                            onClick={() => handleDelete(ticket.id)}
                                            className="text-red-500 hover:text-red-700 inline-flex items-center"
                                            disabled={loading}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span className="sr-only">Delete</span>
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