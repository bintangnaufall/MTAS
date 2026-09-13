<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Rate limiter for public form submissions (5 requests per minute per IP)
        RateLimiter::for('public-forms', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip())->response(function (Request $request, array $headers) {
                if ($request->wantsJson() && !$request->header('X-Inertia')) {
                    return response()->json([
                        'message' => 'Terlalu banyak permintaan pengiriman formulir. Demi keamanan dan pencegahan spam, silakan tunggu 1 menit.',
                    ], 429, $headers);
                }

                return redirect()->back()->withErrors([
                    'rate_limit' => 'Terlalu banyak permintaan dalam waktu singkat. Demi keamanan dan pencegahan bot spam, silakan tunggu 1 menit sebelum mengirim formulir kembali.',
                ])->with('error', 'Terlalu banyak permintaan. Silakan tunggu 1 menit.');
            });
        });
    }
}
