<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MusicaController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//-------------------------------------------------------------------------------------

Route::prefix('musicas')->group(function () {

    Route::get('/', [MusicaController::class, 'index']); // Lista top 5 músicas

    Route::post('/', [MusicaController::class, 'store']); // Adiciona nova música via URL

});

//-------------------------------------------------------------------------------------

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('musicas/{id}/approve', [MusicaController::class, 'approve']);

    Route::post('musicas/{id}/reject', [MusicaController::class, 'reject']);

    Route::delete('musicas/{id}/remove', [MusicaController::class, 'remove']);
    
});



