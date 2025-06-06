import React, { useState } from 'react';

function EditTicketForm({ ticket: initialTicket }) {
    // Get data from the DOM element (passed by Blade)
    const formRootElement = document.getElementById('edit-ticket-form-root');
    const csrfToken = formRootElement.dataset.csrfToken;
    const formAction = formRootElement.dataset.formAction;

    const [formData, setFormData] = useState({
        customer_name: initialTicket.customer_name || '',
        issue_description: initialTicket.issue_description || '',
        priority: initialTicket.priority || 'medium',
        status: initialTicket.status || 'open'
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Create a hidden form and submit it to Laravel
        const form = document.createElement('form');
        form.method = 'POST'; 
        form.action = formAction;

        // Add CSRF token
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = '_token';
        tokenInput.value = csrfToken;
        form.appendChild(tokenInput);

        // Add _method for PUT/PATCH spoofing
        const methodInput = document.createElement('input');
        methodInput.type = 'hidden';
        methodInput.name = '_method';
        methodInput.value = 'PUT';
        form.appendChild(methodInput);

        // Add form data
        for (const key in formData) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = formData[key];
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {loading && (
                <div className="text-center text-blue-500 py-2">Updating...</div>
            )}

            <div className="mb-4">
                <label htmlFor="customer_name" className="block text-gray-700 text-sm font-bold mb-2">Customer Name:</label>
                <input
                    type="text"
                    name="customer_name"
                    id="customer_name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed" // Added bg-gray-100 and cursor-not-allowed for styling
                    value={formData.customer_name}
                    onChange={handleChange} 
                    required
                    disabled={true} 
                />
                {errors.customer_name && <p className="text-red-500 text-xs italic mt-2">{errors.customer_name[0]}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="issue_description" className="block text-gray-700 text-sm font-bold mb-2">Issue Description:</label>
                <textarea
                    name="issue_description"
                    id="issue_description"
                    rows="5"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed" // Added bg-gray-100 and cursor-not-allowed for styling
                    value={formData.issue_description}
                    onChange={handleChange} 
                    required
                    disabled={true} 
                ></textarea>
                {errors.issue_description && <p className="text-red-500 text-xs italic mt-2">{errors.issue_description[0]}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2">Priority:</label>
                <select
                    name="priority"
                    id="priority"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.priority}
                    onChange={handleChange}
                    disabled={loading}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                {errors.priority && <p className="text-red-500 text-xs italic mt-2">{errors.priority[0]}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
                <select
                    name="status"
                    id="status"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={loading}
                >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>
                {errors.status && <p className="text-red-500 text-xs italic mt-2">{errors.status[0]}</p>}
            </div>

            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Ticket'}
                </button>

                <a href="/tickets" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                    Cancel
                </a>
            </div>
        </form>
    );
}

export default EditTicketForm;