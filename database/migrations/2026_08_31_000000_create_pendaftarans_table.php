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
        Schema::create('pendaftarans', function (Blueprint $table) {
            $table->id();
            $table->string('no_pendaftaran')->nullable()->unique();
            $table->string('nama_lengkap');
            $table->string('jenis_maktab')->default('Maktab Tuli As-Sami');
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan'])->default('Laki-laki');
            $table->text('alamat_domisili')->nullable();
            $table->string('nama_ortu');
            $table->string('no_hp_ortu');
            $table->string('pekerjaan_ortu')->nullable();
            $table->text('alamat_ortu')->nullable();
            $table->text('keterangan_tambahan')->nullable();
            $table->string('foto_santri')->nullable();
            $table->string('kartu_keluarga')->nullable();
            $table->string('ktp_ortu')->nullable();
            $table->string('status')->default('Menunggu Verifikasi'); // Menunggu Verifikasi, Diproses, Lulus, Ditolak
            $table->text('catatan_admin')->nullable();
            $table->unsignedBigInteger('santri_id')->nullable();
            $table->timestamp('tanggal_verifikasi')->nullable();
            $table->timestamps();

            $table->foreign('santri_id')->references('id')->on('santris')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftarans');
    }
};
