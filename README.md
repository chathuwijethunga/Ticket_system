# Ticket_system

This project is a web application for managing support tickets. It uses Laravel for the backend and React.js for the frontend.

Setup Instructions
Follow these steps to get the project running on your local machine.

1. Clone the Repository

git clone <https://github.com/chathuwijethunga/Ticket_system>
cd ticket_system

2. Install PHP Dependencies

Install Laravel's dependencies using Composer using composer install

3. Configure Environment File

Generate an application key using php artisan key:generate

Edit the .env file. Set your database credentials.

DB_CONNECTION=sqlite

4. Run Database Migrations

Run migrations to set up your database tables using php artisan migrate

You can seed the database with test data using php artisan db:seed

5. Install Node.js Dependencies

Install frontend dependencies using npm using npm install

6. Bundle React Assets

Build the React assets for production using npm run build

For development, run the Vite development server. This will watch for changes and automatically refresh your browser using npm run dev

Keep this command running in a separate terminal while developing.

7. Start Laravel Development Server

Serve the Laravel application using php artisan serve

Access the application in your browser at http://127.0.0.1:8000.

8. React Component Integration

React components are mounted into specific HTML elements within Laravel's Blade templates.

Blade Template: A Blade view (e.g., resources/views/tickets/index.blade.php) has a div element. This div has a unique ID, like <div id="ticket-list-root"></div>. It can also pass initial data using data-\_ attributes.

React Entry Point (resources/js/app.jsx): This file finds the div element by its ID.
Mounting: ReactDOM.createRoot().render() is used. This renders the React component (e.g., TicketList) into the div.

Data Flow: React components access data from the data-\_ attributes of their root div. For example, a filter status or CSRF token.

## Development Approach and Challenges

### Development Approach

Laravel as API: Laravel handles data storage and routing. It serves JSON data to React.
React for UI: React manages the dynamic parts of the user interface. This includes lists, forms, and interactive elements.

Vite for Bundling: Vite bundles React code and other frontend assets. It provides fast development.
Tailwind CSS: Tailwind CSS is used for styling. It allows rapid UI development with utility classes.

### Challenges Faced

CSRF Token Handling: Passing CSRF tokens from Laravel to React is important. This ensures secure form submissions and API calls.

Method Spoofing for DELETE: Direct DELETE requests from React to Laravel web routes showed errors. Laravel expects \_method=DELETE in POST requests for web routes. The solution involves submitting a hidden form for deletions.
