@extends('layouts.app')

@section('content')
    <div class="container mx-auto p-4">
        <h1 class="text-4xl font-bold mb-6 text-gray-800">Support Tickets</h1>

        {{-- The root element for your React TicketList component --}}
        {{-- Pass initial tickets data as a JSON string --}}
        <div id="ticket-list-root" data-tickets="{{ $tickets->toJson() }}"></div>

        <a href="{{ route('tickets.create') }}" class="mt-4 inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Create New Ticket
        </a>

        {{-- Display flash messages (success/error) from Laravel --}}
        @if (session('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
                <strong class="font-bold">Success!</strong>
                <span class="block sm:inline">{{ session('success') }}</span>
            </div>
        @endif
        @if (session('error'))
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                <strong class="font-bold">Error!</strong>
                <span class="block sm:inline">{{ session('error') }}</span>
            </div>
        @endif
    </div>
@endsection