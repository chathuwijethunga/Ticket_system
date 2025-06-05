import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'; // <--- CRITICAL LINE

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx' // Changed from .js to .jsx for React
            ], 

            refresh: true,
        }),
        react(), // <--- CRITICAL PLUGIN USAGE
    ],
});