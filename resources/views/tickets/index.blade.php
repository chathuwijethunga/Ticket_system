<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>All Tickets</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100 p-8">
        <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-gray-800">All Tickets</h1>
                <a href="{{ route('tickets.create') }}" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Create New Ticket
                </a>
            </div>
            {{-- Status Filters --}}
            <div class="mb-4">
                <a href="{{ route('tickets.index') }}" class="mr-2 px-3 py-1 rounded-md text-sm @unless(request('status')) bg-blue-500 text-white @else bg-gray-200 text-gray-700 hover:bg-gray-300 @endunless">All</a>
                <a href="{{ route('tickets.index', ['status' => 'open']) }}" class="mr-2 px-3 py-1 rounded-md text-sm @if(request('status') === 'open') bg-blue-500 text-white @else bg-gray-200 text-gray-700 hover:bg-gray-300 @endif">Open</a>
                <a href="{{ route('tickets.index', ['status' => 'closed']) }}" class="px-3 py-1 rounded-md text-sm @if(request('status') === 'closed') bg-blue-500 text-white @else bg-gray-200 text-gray-700 hover:bg-gray-300 @endif">Closed</a>
            </div>

            @if ($tickets->isEmpty())
                <p class="text-gray-600">No tickets found.</p>
            {{-- Success/Error Flash Messages --}}
                @if (session('success'))
                    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong class="font-bold">Success!</strong>
                        <span class="block sm:inline">{{ session('success') }}</span>
                    </div>
                @endif

                {{-- You can add similar blocks for 'error' or 'warning' if you use them --}}
                @if (session('error'))
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong class="font-bold">Error!</strong>
                        <span class="block sm:inline">{{ session('error') }}</span>
                    </div>
                @endif
            @else
                <div class="overflow-x-auto">
                    <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th class="py-3 px-6 text-left">ID</th>
                                <th class="py-3 px-6 text-left">Customer Name</th>
                                <th class="py-3 px-6 text-left">Issue Description</th>
                                <th class="py-3 px-6 text-left">Priority</th>
                                <th class="py-3 px-6 text-left">Status</th>
                                <th class="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-600 text-sm font-light">
                            @foreach ($tickets as $ticket)
                                <tr class="border-b border-gray-200 hover:bg-gray-50">
                                    <td class="py-3 px-6 text-left whitespace-nowrap">{{ $ticket->id }}</td>
                                    <td class="py-3 px-6 text-left">{{ $ticket->customer_name }}</td>
                                    <td class="py-3 px-6 text-left">{{ Str::limit($ticket->issue_description, 50) }}</td>
                                    <td class="py-3 px-6 text-left">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full
                                            @if($ticket->priority == 'high') bg-red-200 text-red-800
                                            @elseif($ticket->priority == 'medium') bg-yellow-200 text-yellow-800
                                            @else bg-green-200 text-green-800 @endif">
                                            {{ ucfirst($ticket->priority) }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-6 text-left">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full
                                            @if($ticket->status == 'open') bg-blue-200 text-blue-800
                                            @else bg-gray-200 text-gray-800 @endif">
                                            {{ ucfirst($ticket->status) }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-6 text-center">
                                        <div class="flex item-center justify-center">
                                            <a href="{{ route('tickets.edit', $ticket->id) }}" class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </a>
                                            {{-- Delete Form (will be implemented in a later step) --}}
                                            <form action="{{ route('tickets.destroy', $ticket->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this ticket?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="w-4 mr-2 transform hover:text-red-500 hover:scale-110">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>
    </body>
</html>
