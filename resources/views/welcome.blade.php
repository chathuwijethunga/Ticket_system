<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to the Ticket System</title>
        @vite(['resources/css/app.css', 'resources/js/app.jsx']) {{-- Include your assets --}}
    </head>
    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
        <div class="text-center p-8 bg-white rounded-lg shadow-lg">
            <h1 class="text-5xl font-bold text-gray-800 mb-4">Welcome!</h1>
            <p class="text-xl text-gray-600 mb-8">Your Customer Support Ticket System</p>

            @if (Route::has('login'))
                <div class="mt-4 space-x-4">
                    @auth
                        <a href="{{ url('/tickets') }}" class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300">
                            Go to Tickets
                        </a>
                    @else
                        <a href="{{ route('login') }}" class="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300">
                            Log in
                        </a>

                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="inline-block bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300">
                                Register
                            </a>
                        @endif
                    @endauth
                </div>
            @endif
        </div>
    </body>
</html>