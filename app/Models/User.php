<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'phone',
        'jabatan',
        'bio',
        'password',
        'avatar',
        'google_id',
        'role',
        'preferences',
        'last_login_at',
        'last_login_ip',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'role_label',
        'role_badge',
        'initials',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'preferences' => 'array',
        ];
    }

    /**
     * Get initials of the user name (max 2 characters).
     */
    public function getInitialsAttribute(): string
    {
        $segments = array_filter(explode(' ', trim($this->name ?: 'User')));
        $initials = '';
        foreach (array_slice($segments, 0, 2) as $segment) {
            $initials .= mb_substr($segment, 0, 1);
        }
        return strtoupper($initials ?: 'US');
    }

    /**
     * Label representatif untuk role user.
     */
    public function getRoleLabelAttribute(): string
    {
        return match ($this->role) {
            'super_admin' => 'Super Admin',
            'admin'       => 'Administrator',
            'editor'      => 'Editor',
            'staff'       => 'Staff Pengurus',
            default       => ucfirst(str_replace('_', ' ', $this->role ?? 'User')),
        };
    }

    /**
     * Badge visual styling untuk role user.
     */
    public function getRoleBadgeAttribute(): array
    {
        return match ($this->role) {
            'super_admin' => [
                'bg' => 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
                'color' => '#7e22ce',
                'icon' => 'shield_person',
            ],
            'admin' => [
                'bg' => 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                'color' => '#047857',
                'icon' => 'admin_panel_settings',
            ],
            'editor' => [
                'bg' => 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                'color' => '#1d4ed8',
                'icon' => 'edit_note',
            ],
            'staff' => [
                'bg' => 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                'color' => '#b45309',
                'icon' => 'badge',
            ],
            default => [
                'bg' => 'bg-gray-100 text-gray-700 border-gray-200',
                'color' => '#4b5563',
                'icon' => 'person',
            ],
        };
    }

    /**
     * Check if user has a specific role or any of given roles.
     */
    public function hasRole(string|array $roles): bool
    {
        if (is_array($roles)) {
            return in_array($this->role, $roles, true);
        }

        return $this->role === $roles;
    }

    /**
     * Check if user is Super Admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    /**
     * Check if user is at least Admin.
     */
    public function isAdmin(): bool
    {
        return in_array($this->role, ['super_admin', 'admin'], true);
    }

    /**
     * Check if user is Editor or above.
     */
    public function isEditor(): bool
    {
        return in_array($this->role, ['super_admin', 'admin', 'editor'], true);
    }

    /**
     * Check if user is Staff or above.
     */
    public function isStaff(): bool
    {
        return in_array($this->role, ['super_admin', 'admin', 'editor', 'staff'], true);
    }
}
