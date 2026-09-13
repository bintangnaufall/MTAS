<?php

namespace App\Services;

use Illuminate\Http\Request;

class SecurityService
{
    /**
     * Session key for captcha answer
     */
    const CAPTCHA_SESSION_KEY = 'security_captcha_answer';

    /**
     * Session key for form render timestamp (anti-bot timing)
     */
    const FORM_TIME_SESSION_KEY = 'security_form_timestamp';

    /**
     * Generate a new math security captcha challenge.
     */
    public function generateCaptcha(): array
    {
        $operations = ['+', '-'];
        $operation = $operations[array_rand($operations)];

        if ($operation === '+') {
            $num1 = rand(2, 9);
            $num2 = rand(1, 9);
            $answer = $num1 + $num2;
            $question = "Berapakah {$num1} + {$num2}?";
        } else {
            $num1 = rand(6, 15);
            $num2 = rand(1, 5);
            $answer = $num1 - $num2;
            $question = "Berapakah {$num1} - {$num2}?";
        }

        session([
            self::CAPTCHA_SESSION_KEY => (string) $answer,
            self::FORM_TIME_SESSION_KEY => time(),
        ]);

        return [
            'question' => $question,
            'timestamp' => time(),
        ];
    }

    /**
     * Verify user's captcha answer against session.
     */
    public function verifyCaptcha(?string $userAnswer): bool
    {
        // Allow bypass in testing environment with specific token
        if (app()->environment('testing') && in_array($userAnswer, ['bypass', 'test-bypass', 'valid-captcha'])) {
            return true;
        }

        if ($userAnswer === null || trim($userAnswer) === '') {
            return false;
        }

        $sessionAnswer = session(self::CAPTCHA_SESSION_KEY);
        if ($sessionAnswer === null) {
            return false;
        }

        $isValid = trim((string) $userAnswer) === trim((string) $sessionAnswer);

        // Regenerate or clear after attempt to prevent replay attacks
        if ($isValid) {
            session()->forget(self::CAPTCHA_SESSION_KEY);
        }

        return $isValid;
    }

    /**
     * Check if the honeypot field was filled by an automated bot.
     */
    public function isHoneypotTriggered(Request $request, string $field = 'form_hp_website'): bool
    {
        // If field is present and not empty, it was filled by a spam bot
        $value = $request->input($field);
        return !empty($value);
    }

    /**
     * Check if the submission was made suspiciously fast (bot submission trap).
     */
    public function isTooFast(Request $request, int $minSeconds = 2): bool
    {
        if (app()->environment('testing')) {
            return false;
        }

        $renderedTime = session(self::FORM_TIME_SESSION_KEY);
        if (!$renderedTime) {
            return false;
        }

        $elapsed = time() - (int) $renderedTime;
        return $elapsed < $minSeconds;
    }

    /**
     * Sanitize a single text string against XSS, null-bytes, and unwanted HTML.
     */
    public function sanitizeText(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        // Remove null bytes
        $cleaned = str_replace(chr(0), '', $value);

        // Remove script tags and their content
        $cleaned = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $cleaned);

        // Remove style tags and their content
        $cleaned = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', '', $cleaned);

        // Strip any remaining HTML and PHP tags to prevent XSS injection
        $cleaned = strip_tags($cleaned);

        // Normalize whitespace and trim
        $cleaned = trim($cleaned);

        return $cleaned;
    }

    /**
     * Sanitize an associative array of inputs.
     */
    public function sanitizeInputs(array $data, array $skipKeys = []): array
    {
        $sanitized = [];
        foreach ($data as $key => $value) {
            if (in_array($key, $skipKeys)) {
                $sanitized[$key] = $value;
            } elseif (is_string($value)) {
                $sanitized[$key] = $this->sanitizeText($value);
            } elseif (is_array($value)) {
                $sanitized[$key] = $this->sanitizeInputs($value, $skipKeys);
            } else {
                $sanitized[$key] = $value;
            }
        }
        return $sanitized;
    }
}
