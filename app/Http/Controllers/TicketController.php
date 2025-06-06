<?php

namespace App\Http\Controllers;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Ticket::query();

        // filter open/closed
        $statusFilter = $request->input('status', 'all');
        if ($statusFilter !== 'all') {
            $query->where('status', $statusFilter);
        }

        //Search
        $searchTerm = $request->input('search');
        if (!empty($searchTerm)) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('customer_name', 'like', '%' . $searchTerm . '%')
                  ->orWhere('issue_description', 'like', '%' . $searchTerm . '%');
            });
        }

        // Order of the tickets
        $tickets = $query->orderBy('created_at', 'desc')->get();

        $openTicketsCount = Ticket::where('status', 'open')->count();
        $closedTicketsCount = Ticket::where('status', 'closed')->count();
        $allTicketsCount = Ticket::count(); // Total tickets regardless of status

        //return json res
        if ($request->wantsJson()) {
            return response()->json([
                'tickets' => $tickets,
                'counts' => [
                    'open' => $openTicketsCount,
                    'closed' => $closedTicketsCount,
                    'all' => $allTicketsCount,
                ],
            ]);
        }

        // Othervise, return Blade view 
        return view('tickets.index', [
            'tickets' => $tickets,
            'filterStatus' => $statusFilter,
            'openTicketsCount' => $openTicketsCount, 
            'closedTicketsCount' => $closedTicketsCount,
            'allTicketsCount' => $allTicketsCount,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('tickets.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'customer_name' => 'required|string|max:255',
            'issue_description' => 'required|string',
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'status' => ['required', Rule::in(['open', 'closed'])],       
        ]);
        Ticket::create($validatedData);

        return redirect()->route('tickets.index')->with('success', 'Ticket created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        return view('tickets.show', compact('ticket'));
    }

    /**
     * Show the form for editing the specified resource.
     */
        
    public function edit(Ticket $ticket)
    {
        return view('tickets.edit', compact('ticket'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        $validatedData = $request->validate([
            'customer_name'   => 'required|string|max:255',
            'issue_description' => 'required|string',
            'priority'          => ['required', Rule::in(['low', 'medium', 'high'])],
            'status'            => ['required', Rule::in(['open', 'closed'])],
        ]);
        $ticket->update($validatedData);
        return redirect()->route('tickets.index')->with('success', 'Ticket updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        $ticket->delete();
        return redirect()->route('tickets.index')->with('success', 'Ticket deleted successfully!');
    }
}
