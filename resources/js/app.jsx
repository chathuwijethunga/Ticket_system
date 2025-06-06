import './bootstrap';
import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';

window.Alpine = Alpine;
Alpine.plugin(focus);
Alpine.start();

import React from 'react';
import { createRoot } from 'react-dom/client'; 

import TicketList from './Components/TicketList';
import CreateTicketForm from './Components/CreateTicketForm';
import EditTicketForm from './Components/EditTicketForm';
import TicketDetail from './Components/TicketDetail'; 

// mMounts components to specific DOM elements
document.addEventListener('DOMContentLoaded', () => {
    const ticketListElement = document.getElementById('ticket-list-root');
    if (ticketListElement) {
        createRoot(ticketListElement).render(<TicketList />);
    }

    const createTicketFormElement = document.getElementById('create-ticket-form-root');
    if (createTicketFormElement) {
        const csrfToken = createTicketFormElement.dataset.csrfToken;
        const formAction = createTicketFormElement.dataset.formAction;
        createRoot(createTicketFormElement).render(<CreateTicketForm csrfToken={csrfToken} formAction={formAction} />);
    }

    const editTicketFormElement = document.getElementById('edit-ticket-form-root');
    if (editTicketFormElement) {
        const ticketData = JSON.parse(editTicketFormElement.dataset.ticket || '{}');
        createRoot(editTicketFormElement).render(<EditTicketForm ticket={ticketData} />);
    }

    const ticketDetailRoot = document.getElementById('ticket-detail-root');
    if (ticketDetailRoot) {
        const ticketData = ticketDetailRoot.dataset.ticket;
        let parsedTicket = null;
        try {
            parsedTicket = JSON.parse(ticketData);
        } catch (e) {
            console.error("Failed to parse ticket data:", e);
        }

        if (parsedTicket) {
            createRoot(ticketDetailRoot).render(<TicketDetail ticket={parsedTicket} />); 
        } else {
            console.warn("No valid ticket data found for TicketDetail component.");
        }
    }
});