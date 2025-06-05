<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Ticket;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Ticket::create([
            'customer_name' => 'Customer 1',
            'issue_description' => 'Cannot log in to my account after password reset. Getting an invalid credentials error.',
            'priority' => 'high',
            'status' => 'open',
        ]);

        Ticket::create([
            'customer_name' => 'Cus 2',
            'issue_description' => 'Delivery for order #12345 is delayed. Tracking shows no update for 3 days.',
            'priority' => 'medium',
            'status' => 'open',
        ]);

        Ticket::create([
            'customer_name' => 'Cus 3',
            'issue_description' => 'Received wrong item in order #67890. Ordered a blue shirt, received a red one.',
            'priority' => 'low',
            'status' => 'closed', // This ticket is already closed
        ]);
    }
}
