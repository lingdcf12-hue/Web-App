<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TransactionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check endpoint
Route::get('/', function () {
    return response()->json([
        'message' => 'LuckyAndPower API',
        'status' => 'ok',
        'timestamp' => now()
    ]);
});

// Transaction endpoints
Route::get('/transactions', [TransactionController::class, 'index']);
Route::post('/transactions', [TransactionController::class, 'store']);
Route::get('/transactions/{id}', [TransactionController::class, 'show']);
Route::put('/transactions/{id}', [TransactionController::class, 'update']);
Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);

// Filter endpoint
Route::post('/transactions/filter', [TransactionController::class, 'filter']);

// Dashboard endpoints
Route::get('/dashboard/summary', [TransactionController::class, 'dashboardSummary']);
Route::get('/dashboard/stats', [TransactionController::class, 'dashboardStats']);
Route::get('/dashboard/reports', [TransactionController::class, 'dashboardReports']);

// Categories endpoint
Route::get('/categories', [TransactionController::class, 'categories']);
