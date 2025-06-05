import './bootstrap'; // Laravel specific, can keep or remove if not needed
import '../css/app.css'; // For Tailwind CSS

import React from 'react';
import ReactDOM from 'react-dom/client';

// Import your React components
import TicketList from './components/TicketList'; // We will create this next

// Function to mount a specific React component to a given root element
function mountReactComponent(Component, rootId) {
    const rootElement = document.getElementById(rootId);
    if (rootElement) {
        // Get data from data attributes on the root element
        const props = {};
        for (const key in rootElement.dataset) {
            try {
                // Attempt to parse JSON strings
                props[key] = JSON.parse(rootElement.dataset[key]);
            } catch (e) {
                // If not JSON, use the raw string
                props[key] = rootElement.dataset[key];
            }
        }

        // Render the component with the collected props
        ReactDOM.createRoot(rootElement).render(
            <React.StrictMode>
                <Component {...props} />
            </React.StrictMode>
        );
    }
}

// --- Mount your specific components here ---
// Mount TicketList component to the 'ticket-list-root' element
mountReactComponent(TicketList, 'ticket-list-root');

// You will add more mountReactComponent calls for other components later
// Example: mountReactComponent(CreateTicketForm, 'create-ticket-root');
// Example: mountReactComponent(EditTicketForm, 'edit-ticket-root');