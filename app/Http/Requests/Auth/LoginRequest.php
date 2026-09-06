<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $loginInput = $this->input('email');
        $password = $this->input('password');
        $remember = $this->boolean('remember');

        // Determine if input is email or username
        $fieldType = filter_var($loginInput, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $credentials = [
            $fieldType => $loginInput,
            'password' => $password,
        ];

        if (! Auth::attempt($credentials, $remember)) {
            // Fallback attempt: try email if username was assumed or vice versa
            $altField = ($fieldType === 'email') ? 'username' : 'email';
            $altCredentials = [
                $altField => $loginInput,
                'password' => $password,
            ];

            if (! Auth::attempt($altCredentials, $remember)) {
                RateLimiter::hit($this->throttleKey());

                Log::warning("Security Warning: Failed login attempt for input '{$loginInput}' from IP {$this->ip()}");

                throw ValidationException::withMessages([
                    'email' => 'Kredensial yang Anda masukkan tidak cocok dengan data kami.',
                ]);
            }
        }

        RateLimiter::clear($this->throttleKey());

        Log::info("Security Audit: Successful login for user " . Auth::user()->email . " from IP {$this->ip()}");
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        Log::warning("Security Alert: Rate limit exceeded for login attempts from IP {$this->ip()}");

        throw ValidationException::withMessages([
            'email' => "Terlalu banyak percobaan login. Silakan coba lagi dalam {$seconds} detik.",
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
