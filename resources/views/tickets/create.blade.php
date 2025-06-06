@extends('layouts.app')

@section('content')
    <div class="container mx-auto p-4">
        <div class="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-gray-800">Create New Ticket</h1>
                <a href="{{ route('tickets.index') }}" class="text-blue-500 hover:underline">Back to Tickets</a>
                
            </div>

            {{-- The root element for React CreateTicketForm component --}}
            {{-- Pass CSRF token and form action URL --}}
            <div
                id="create-ticket-form-root"
                data-csrf-token="{{ csrf_token() }}"
                data-form-action="{{ route('tickets.store') }}"
            >
            
            </div>
            

            {{-- Display flash messages --}}
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
    </div>
@endsection