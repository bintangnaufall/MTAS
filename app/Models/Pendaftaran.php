<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pendaftaran extends Model
{
    use HasFactory;

    protected $table = 'pendaftarans';

    protected $fillable = [
        'no_pendaftaran',
        'nama_lengkap',
        'jenis_maktab',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'alamat_domisili',
        'nama_ortu',
        'no_hp_ortu',
        'pekerjaan_ortu',
        'alamat_ortu',
        'keterangan_tambahan',
        'foto_santri',
        'kartu_keluarga',
        'ktp_ortu',
        'status',
        'catatan_admin',
        'santri_id',
        'tanggal_verifikasi',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tanggal_verifikasi' => 'datetime',
    ];

    /**
     * Helper to generate unique Registration Number (e.g. REG-2026-001)
     */
    public static function generateNoPendaftaran(): string
    {
        $year = date('Y');
        $prefix = 'REG-' . $year . '-';
        $latest = self::where('no_pendaftaran', 'LIKE', $prefix . '%')->orderBy('id', 'desc')->first();

        if ($latest && preg_match('/' . preg_quote($prefix, '/') . '(\d+)/', $latest->no_pendaftaran, $matches)) {
            $nextNum = intval($matches[1]) + 1;
        } else {
            $nextNum = 1;
        }

        return $prefix . str_pad($nextNum, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Relationship to Santri model if enrolled
     */
    public function santri()
    {
        return $this->belongsTo(Santri::class, 'santri_id');
    }
}
