<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use Carbon\Carbon;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $transactions = [
            [
                'type' => 'income',
                'amount' => 5000000,
                'category' => 'Salary',
                'date' => Carbon::now()->startOfMonth()->setHour(0)->setMinute(0)->setSecond(0),
                'notes' => 'Monthly salary',
            ],
            [
                'type' => 'expense',
                'amount' => 50000,
                'category' => 'Food',
                'date' => Carbon::now()->setHour(10)->setMinute(30)->setSecond(0),
                'notes' => 'Lunch with team',
            ],
            [
                'type' => 'expense',
                'amount' => 100000,
                'category' => 'Transport',
                'date' => Carbon::now()->setHour(8)->setMinute(0)->setSecond(0),
                'notes' => 'Gas for car',
            ],
            [
                'type' => 'expense',
                'amount' => 150000,
                'category' => 'Entertainment',
                'date' => Carbon::now()->subDay()->setHour(19)->setMinute(0)->setSecond(0),
                'notes' => 'Movie tickets',
            ],
            [
                'type' => 'income',
                'amount' => 500000,
                'category' => 'Bonus',
                'date' => Carbon::now()->subDays(2)->setHour(14)->setMinute(0)->setSecond(0),
                'notes' => 'Project bonus',
            ],
        ];

        foreach ($transactions as $transaction) {
            Transaction::create($transaction);
        }
    }
}
