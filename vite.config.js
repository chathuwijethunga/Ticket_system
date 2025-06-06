import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'; // Make sure this is imported

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx', // <--- Ensure this is app.jsx
            ],
            refresh: true,
        }),
        react(), // <--- Ensure the react plugin is listed here
    ],
});