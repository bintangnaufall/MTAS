<?php

namespace App\Http\Controllers;

use App\Services\SecurityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SecurityController extends Controller
{
    /**
     * Refresh the security captcha challenge and return question JSON.
     */
    public function refreshCaptcha(Request $request, SecurityService $security): JsonResponse
    {
        $captcha = $security->generateCaptcha();

        return response()->json([
            'success' => true,
            'question' => $captcha['question'],
        ]);
    }
}
