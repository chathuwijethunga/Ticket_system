@extends('layouts.app')

@section('content')
    <div class="container mx-auto p-4">
        <div class="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-gray-800">Ticket Details</h1>
                <a href="{{ route('tickets.index') }}" class="text-blue-500 hover:underline">Back to Tickets</a>
            </div>

            {{-- Mount point for React TicketDetail component --}}
            <div
                id="ticket-detail-root"
                data-ticket="{{ json_encode($ticket) }}" {{-- Pass the ticket object as JSON --}}
            ></div>

            {{-- The rest of your Blade code for buttons and messages can remain if you want --}}
            {{-- For instance, the buttons for Edit/Delete can still be pure Blade/HTML --}}
            <div class="flex justify-end gap-2 mt-6"> {{-- Added mt-6 for spacing from React component --}}
                <a href="{{ route('tickets.edit', $ticket->id) }}" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">Edit Ticket</a>

                <form action="{{ route('tickets.destroy', $ticket->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this ticket?');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">Delete Ticket</button>
                </form>
            </div>
        </div>
    </div>
@endsection