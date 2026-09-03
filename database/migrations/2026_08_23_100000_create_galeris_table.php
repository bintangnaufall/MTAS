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
        Schema::create('galeris', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('kategori')->default('Kegiatan Yayasan'); // Maktab Tuli, Maktab Autis, Kegiatan Yayasan, Pembelajaran, Acara Sosial, dll
            $table->string('tipe')->default('foto'); // 'foto' atau 'video'
            $table->longText('image')->nullable(); // URL atau path ke gambar/thumbnail
            $table->string('video_url')->nullable(); // URL video (YouTube embed/link)
            $table->string('duration')->nullable(); // Durasi video, e.g. "04:25"
            $table->string('tanggal')->nullable(); // Tanggal kegiatan
            $table->text('deskripsi')->nullable();
            $table->boolean('is_featured')->default(false); // Kegiatan Utama / Featured
            $table->string('status')->default('Published'); // Published / Draft
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('galeris');
    }
};
