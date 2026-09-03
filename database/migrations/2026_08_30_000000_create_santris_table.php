<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('santris', function (Blueprint $table) {
            $table->id();
            $table->string('nis')->nullable()->unique();
            $table->string('nama_lengkap');
            $table->string('nama_panggilan')->nullable();
            $table->string('program')->default('Maktab Tuli As-Sami');
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan'])->default('Laki-laki');
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->date('tanggal_masuk')->nullable();
            $table->string('status')->default('Aktif'); // Aktif, Menunggu Verifikasi, Lulus, Pindahan, Non-Aktif
            $table->string('nama_ortu');
            $table->string('no_hp_ortu');
            $table->string('pekerjaan_ortu')->nullable();
            $table->text('alamat')->nullable();
            $table->text('keterangan')->nullable();
            $table->string('foto')->nullable();
            $table->string('kartu_keluarga')->nullable();
            $table->string('ktp_ortu')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('santris');
    }
};
