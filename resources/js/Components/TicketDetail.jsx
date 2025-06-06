import React from 'react';
import PropTypes from 'prop-types'; 
const TicketDetail = ({ ticket }) => {
    if (!ticket) {
        return <div className="text-center text-gray-500">No ticket data available.</div>;
    }

    //  status text color
    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'text-blue-600';
            case 'closed':
                return 'text-gray-600';
            default:
                return 'text-gray-600';
        }
    };

    // priority text color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low':
                return 'text-green-600';
            case 'medium':
                return 'text-yellow-600';
            case 'high':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    // dates 
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    return (
        <div className="border border-gray-200 rounded-md p-4 mb-6">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Ticket ID:</label>
                <p className="text-gray-900 text-lg font-semibold">{ticket.id}</p>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Customer Name:</label>
                <p className="text-gray-900">{ticket.customer_name}</p>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Issue Description:</label>
                <p className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-800 break-words whitespace-pre-wrap">
                    {ticket.issue_description}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Priority:</label>
                    <p className={`font-semibold capitalize ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                    </p>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
                    <p className={`font-semibold capitalize ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                    </p>
                </div>
            </div>

            <div className="text-gray-600 text-sm">
                <p><strong>Created At:</strong> {formatDate(ticket.created_at)}</p>
                <p><strong>Last Updated At:</strong> {formatDate(ticket.updated_at)}</p>
            </div>
        </div>
    );
};

// Define PropTypes for the component to ensure data consistency
TicketDetail.propTypes = {
    ticket: PropTypes.shape({
        id: PropTypes.number.isRequired,
        customer_name: PropTypes.string.isRequired,
        issue_description: PropTypes.string.isRequired,
        priority: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
        status: PropTypes.oneOf(['open', 'closed']).isRequired,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
    }).isRequired,
};

export default TicketDetail;