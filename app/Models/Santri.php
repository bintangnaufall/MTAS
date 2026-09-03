<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Santri extends Model
{
    use HasFactory;

    protected $fillable = [
        'nis',
        'nama_lengkap',
        'nama_panggilan',
        'program',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'tanggal_masuk',
        'status',
        'nama_ortu',
        'no_hp_ortu',
        'pekerjaan_ortu',
        'alamat',
        'keterangan',
        'foto',
        'kartu_keluarga',
        'ktp_ortu',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tanggal_masuk' => 'date',
    ];

    /**
     * Helper to generate unique NIS
     */
    public static function generateNis(): string
    {
        $year = date('Y');
        $prefix = 'SAN-' . $year . '-';

        // Scan all NIS matching prefix and find max integer suffix
        $allNis = self::where('nis', 'LIKE', $prefix . '%')->pluck('nis');
        $maxNum = 0;
        foreach ($allNis as $val) {
            if (preg_match('/' . preg_quote($prefix, '/') . '(\d+)/', $val, $matches)) {
                $num = intval($matches[1]);
                if ($num > $maxNum) {
                    $maxNum = $num;
                }
            }
        }

        $nextNum = $maxNum + 1;
        $candidate = $prefix . str_pad($nextNum, 3, '0', STR_PAD_LEFT);

        // Guarantee uniqueness against any existing record
        while (self::where('nis', $candidate)->exists()) {
            $nextNum++;
            $candidate = $prefix . str_pad($nextNum, 3, '0', STR_PAD_LEFT);
        }

        return $candidate;
    }

    /**
     * Relationship to Pendaftaran
     */
    public function pendaftaran()
    {
        return $this->hasOne(Pendaftaran::class, 'santri_id');
    }
}
