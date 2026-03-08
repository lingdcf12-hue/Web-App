<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class TransactionController extends Controller
{
    /**
     * GET /transactions
     * Get all transactions
     */
    public function index()
    {
        $transactions = Transaction::orderBy('date', 'desc')->get();
        
        return response()->json($transactions, 200);
    }

    /**
     * POST /transactions
     * Create a new transaction
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type' => 'required|in:income,expense',
                'amount' => 'required|integer|min:1|max:999999999999',
                'category' => 'required|string|min:1|max:50',
                'date' => 'required|date',
                'notes' => 'nullable|string|max:500',
            ]);

            $transaction = Transaction::create([
                'type' => strtolower($validated['type']),
                'amount' => $validated['amount'],
                'category' => $validated['category'],
                'date' => Carbon::parse($validated['date'])->format('Y-m-d H:i:s'),
                'notes' => $validated['notes'] ?? null,
            ]);

            return response()->json($transaction, 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'statusCode' => 400,
                'errors' => $e->errors(),
            ], 400);
        }
    }

    /**
     * GET /transactions/:id
     * Get a single transaction
     */
    public function show($id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json([
                'message' => 'Transaction not found',
                'statusCode' => 404,
            ], 404);
        }

        return response()->json($transaction, 200);
    }

    /**
     * PUT /transactions/:id
     * Update a transaction
     */
    public function update(Request $request, $id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json([
                'message' => 'Transaction not found',
                'statusCode' => 404,
            ], 404);
        }

        try {
            $validated = $request->validate([
                'type' => 'sometimes|in:income,expense',
                'amount' => 'sometimes|integer|min:1|max:999999999999',
                'category' => 'sometimes|string|min:1|max:50',
                'date' => 'sometimes|date',
                'notes' => 'nullable|string|max:500',
            ]);

            if (isset($validated['type'])) {
                $transaction->type = strtolower($validated['type']);
            }
            if (isset($validated['amount'])) {
                $transaction->amount = $validated['amount'];
            }
            if (isset($validated['category'])) {
                $transaction->category = $validated['category'];
            }
            if (isset($validated['date'])) {
                $transaction->date = Carbon::parse($validated['date'])->format('Y-m-d H:i:s');
            }
            if (isset($validated['notes'])) {
                $transaction->notes = $validated['notes'];
            }

            $transaction->save();

            return response()->json($transaction, 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'statusCode' => 400,
                'errors' => $e->errors(),
            ], 400);
        }
    }

    /**
     * DELETE /transactions/:id
     * Delete a transaction
     */
    public function destroy($id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json([
                'message' => 'Transaction not found',
                'statusCode' => 404,
            ], 404);
        }

        $transaction->delete();

        return response()->noContent();
    }

    /**
     * POST /transactions/filter
     * Filter transactions with criteria
     */
    public function filter(Request $request)
    {
        $query = Transaction::query();

        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        if ($request->has('category') && $request->category) {
            $query->whereRaw('LOWER(category) LIKE ?', [strtolower($request->category)]);
        }

        if ($request->has('startDate') && $request->startDate) {
            $query->whereDate('date', '>=', $request->startDate);
        }

        if ($request->has('endDate') && $request->endDate) {
            $query->whereDate('date', '<=', $request->endDate);
        }

        if ($request->has('minAmount') && $request->minAmount !== null) {
            $query->where('amount', '>=', $request->minAmount);
        }

        if ($request->has('maxAmount') && $request->maxAmount !== null) {
            $query->where('amount', '<=', $request->maxAmount);
        }

        $transactions = $query->orderBy('date', 'desc')->get();

        return response()->json($transactions, 200);
    }

    /**
     * GET /dashboard/summary
     * Get summary data for dashboard
     */
    public function dashboardSummary(Request $request)
    {
        $period = $request->query('period', 'monthly');
        
        // Determine date range
        $now = Carbon::now();
        $startDate = match($period) {
            'daily' => $now->clone()->startOfDay(),
            'yearly' => $now->clone()->startOfYear(),
            default => $now->clone()->startOfMonth(),
        };

        // Calculate totals
        $totalIncome = Transaction::where('type', 'income')
            ->where('date', '>=', $startDate)
            ->sum('amount');

        $totalExpense = Transaction::where('type', 'expense')
            ->where('date', '>=', $startDate)
            ->sum('amount');

        $transactionCount = Transaction::where('date', '>=', $startDate)->count();

        // Group by category
        $incomeByType = Transaction::where('type', 'income')
            ->where('date', '>=', $startDate)
            ->groupBy('category')
            ->selectRaw('category, SUM(amount) as total')
            ->pluck('total', 'category')
            ->toArray();

        $expenseByType = Transaction::where('type', 'expense')
            ->where('date', '>=', $startDate)
            ->groupBy('category')
            ->selectRaw('category, SUM(amount) as total')
            ->pluck('total', 'category')
            ->toArray();

        return response()->json([
            'totalIncome' => $totalIncome,
            'totalExpense' => $totalExpense,
            'netBalance' => $totalIncome - $totalExpense,
            'transactionCount' => $transactionCount,
            'currentPeriod' => $period,
            'incomeByType' => $incomeByType,
            'expenseByType' => $expenseByType,
        ], 200);
    }

    /**
     * GET /dashboard/stats
     * Get statistics based on period
     */
    public function dashboardStats(Request $request)
    {
        $period = $request->query('period', 'monthly');
        
        $now = Carbon::now();
        
        // Current period calculations
        $currentStartDate = match($period) {
            'daily' => $now->clone()->startOfDay(),
            'yearly' => $now->clone()->startOfYear(),
            default => $now->clone()->startOfMonth(),
        };
        
        $currentEndDate = match($period) {
            'daily' => $now->clone()->endOfDay(),
            'yearly' => $now->clone()->endOfYear(),
            default => $now->clone()->endOfMonth(),
        };

        // Previous period calculations
        $previousStartDate = match($period) {
            'daily' => $now->clone()->subDay()->startOfDay(),
            'yearly' => $now->clone()->subYear()->startOfYear(),
            default => $now->clone()->subMonth()->startOfMonth(),
        };
        
        $previousEndDate = match($period) {
            'daily' => $now->clone()->subDay()->endOfDay(),
            'yearly' => $now->clone()->subYear()->endOfYear(),
            default => $now->clone()->subMonth()->endOfMonth(),
        };

        // Current period stats
        $currentIncome = Transaction::where('type', 'income')
            ->whereBetween('date', [$currentStartDate, $currentEndDate])
            ->sum('amount');

        $currentExpense = Transaction::where('type', 'expense')
            ->whereBetween('date', [$currentStartDate, $currentEndDate])
            ->sum('amount');

        $currentTransactionCount = Transaction::whereBetween('date', [$currentStartDate, $currentEndDate])->count();

        // Previous period stats
        $previousIncome = Transaction::where('type', 'income')
            ->whereBetween('date', [$previousStartDate, $previousEndDate])
            ->sum('amount');

        $previousExpense = Transaction::where('type', 'expense')
            ->whereBetween('date', [$previousStartDate, $previousEndDate])
            ->sum('amount');

        $previousTransactionCount = Transaction::whereBetween('date', [$previousStartDate, $previousEndDate])->count();

        // Calculate percentage changes
        $incomeChange = $previousIncome > 0 
            ? round((($currentIncome - $previousIncome) / $previousIncome) * 100, 2)
            : 0;

        $expenseChange = $previousExpense > 0 
            ? round((($currentExpense - $previousExpense) / $previousExpense) * 100, 2)
            : 0;

        return response()->json([
            'period' => $period,
            'currentPeriodStats' => [
                'income' => $currentIncome,
                'expense' => $currentExpense,
                'balance' => $currentIncome - $currentExpense,
                'transactionCount' => $currentTransactionCount,
            ],
            'previousPeriodStats' => [
                'income' => $previousIncome,
                'expense' => $previousExpense,
                'balance' => $previousIncome - $previousExpense,
                'transactionCount' => $previousTransactionCount,
            ],
            'incomeChange' => $incomeChange,
            'expenseChange' => $expenseChange,
        ], 200);
    }

    /**
     * GET /dashboard/reports
     * Get data for reports page
     */
    public function dashboardReports()
    {
        $totalIncome = Transaction::where('type', 'income')->sum('amount');
        $totalExpense = Transaction::where('type', 'expense')->sum('amount');
        $netBalance = $totalIncome - $totalExpense;

        // Categories breakdown
        $allTransactions = Transaction::selectRaw('category, type, SUM(amount) as amount')
            ->groupBy('category', 'type')
            ->get();

        $categoriesBreakdown = $allTransactions->map(function ($transaction) use ($totalIncome, $totalExpense) {
            $total = $transaction->type === 'income' ? $totalIncome : $totalExpense;
            $percentage = $total > 0 ? round(($transaction->amount / $total) * 100, 2) : 0;

            return [
                'category' => $transaction->category,
                'type' => $transaction->type,
                'amount' => $transaction->amount,
                'percentage' => $percentage,
            ];
        })->toArray();

        // Monthly trend
        $monthlyTrend = Transaction::selectRaw('DATE_FORMAT(date, "%Y-%m") as month, type, SUM(amount) as total')
            ->groupBy('month', 'type')
            ->orderBy('month', 'asc')
            ->get();

        $trend = [];
        foreach ($monthlyTrend as $item) {
            $month = $item->month;
            if (!isset($trend[$month])) {
                $trend[$month] = ['month' => $month, 'income' => 0, 'expense' => 0];
            }
            if ($item->type === 'income') {
                $trend[$month]['income'] = $item->total;
            } else {
                $trend[$month]['expense'] = $item->total;
            }
        }

        return response()->json([
            'totalIncome' => $totalIncome,
            'totalExpense' => $totalExpense,
            'netBalance' => $netBalance,
            'categoriesBreakdown' => $categoriesBreakdown,
            'monthlyTrend' => array_values($trend),
        ], 200);
    }

    /**
     * GET /categories
     * Get available categories
     */
    public function categories()
    {
        $incomeCategories = Transaction::where('type', 'income')
            ->distinct('category')
            ->pluck('category')
            ->toArray();

        $expenseCategories = Transaction::where('type', 'expense')
            ->distinct('category')
            ->pluck('category')
            ->toArray();

        return response()->json([
            'income' => $incomeCategories,
            'expense' => $expenseCategories,
        ], 200);
    }
}
