import './bootstrap';
import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';

window.Alpine = Alpine;
Alpine.plugin(focus);
Alpine.start();

import React from 'react';
import { createRoot } from 'react-dom/client'; // <-- Import createRoot directly for React 18

// Import your React components here as you create them
import TicketList from './Components/TicketList';
import CreateTicketForm from './Components/CreateTicketForm';
import EditTicketForm from './Components/EditTicketForm';
import TicketDetail from './Components/TicketDetail'; // <-- Added this import

// Global rendering logic for components
// This mounts components to specific DOM elements
document.addEventListener('DOMContentLoaded', () => {
    const ticketListElement = document.getElementById('ticket-list-root');
    if (ticketListElement) {
        createRoot(ticketListElement).render(<TicketList />);
    }

    const createTicketFormElement = document.getElementById('create-ticket-form-root');
    if (createTicketFormElement) {
        // It's highly recommended to pass csrfToken and formAction as props if your React component handles form submission directly.
        // Example (assuming data attributes exist in your Blade view):
        const csrfToken = createTicketFormElement.dataset.csrfToken;
        const formAction = createTicketFormElement.dataset.formAction;
        createRoot(createTicketFormElement).render(<CreateTicketForm csrfToken={csrfToken} formAction={formAction} />);
        // If your CreateTicketForm renders a traditional HTML form that Laravel handles, then just:
        // createRoot(createTicketFormElement).render(<CreateTicketForm />);
    }

    const editTicketFormElement = document.getElementById('edit-ticket-form-root');
    if (editTicketFormElement) {
        // You'll need to pass initial data to this component
        const ticketData = JSON.parse(editTicketFormElement.dataset.ticket || '{}');
        createRoot(editTicketFormElement).render(<EditTicketForm ticket={ticketData} />);
    }

    const ticketDetailRoot = document.getElementById('ticket-detail-root');
    if (ticketDetailRoot) {
        // Get the ticket data from data attributes
        const ticketData = ticketDetailRoot.dataset.ticket;
        let parsedTicket = null;
        try {
            parsedTicket = JSON.parse(ticketData);
        } catch (e) {
            console.error("Failed to parse ticket data:", e);
        }

        if (parsedTicket) {
            createRoot(ticketDetailRoot).render(<TicketDetail ticket={parsedTicket} />); // <-- Corrected
        } else {
            console.warn("No valid ticket data found for TicketDetail component.");
        }
    }
});