import './bootstrap'; // If you're using Bootstrap for any JS utilities

import React from 'react';
import ReactDOM from 'react-dom/client';

// Import your React components here as you create them
import TicketList from './Components/TicketList';
import CreateTicketForm from './Components/CreateTicketForm';
import EditTicketForm from './Components/EditTicketForm';

// Global rendering logic for components
// This mounts components to specific DOM elements
document.addEventListener('DOMContentLoaded', () => {
    const ticketListElement = document.getElementById('ticket-list-root');
    if (ticketListElement) {
        ReactDOM.createRoot(ticketListElement).render(<TicketList />);
    }

    const createTicketFormElement = document.getElementById('create-ticket-form-root');
    if (createTicketFormElement) {
        ReactDOM.createRoot(createTicketFormElement).render(<CreateTicketForm />);
    }

    const editTicketFormElement = document.getElementById('edit-ticket-form-root');
    if (editTicketFormElement) {
        // You'll need to pass initial data to this component
        const ticketData = JSON.parse(editTicketFormElement.dataset.ticket || '{}');
        ReactDOM.createRoot(editTicketFormElement).render(<EditTicketForm ticket={ticketData} />);
    }
});