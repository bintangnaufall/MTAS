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
        Schema::create('beritas', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('slug')->unique();
            $table->string('kategori')->default('KEGIATAN'); // PENDIDIKAN, KEGIATAN, PENGUMUMAN, MAKTAB TULI, KAJIAN
            $table->longText('image')->nullable();
            $table->string('penulis')->default('Admin Yayasan');
            $table->string('tanggal')->nullable();
            $table->enum('status', ['Published', 'Draft'])->default('Published');
            $table->text('ringkasan')->nullable();
            $table->text('blockquote')->nullable();
            $table->longText('paragraf1')->nullable();
            $table->string('subheading')->nullable();
            $table->longText('paragraf2')->nullable();
            $table->text('blue_quote')->nullable();
            $table->string('blue_quote_author')->nullable();
            $table->longText('paragraf3')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beritas');
    }
};
