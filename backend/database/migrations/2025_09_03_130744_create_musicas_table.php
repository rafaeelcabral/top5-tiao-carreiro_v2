<?php

    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;
    use Illuminate\Support\Facades\DB;

    return new class extends Migration {

        public function up(): void {

            // Criando a tabela 'musicas'
            Schema::create('musicas', function (Blueprint $table) {
                $table->id();
                $table->string('titulo');
                $table->bigInteger('visualizacoes');
                $table->string('youtube_id');
                $table->string('thumb');
                $table->timestamps();
            });

            // Inserindo os 5 registros iniciais
            DB::table('musicas')->insert([
                [
                    'titulo' => 'O Mineiro e o Italiano',
                    'visualizacoes' => 5200000,
                    'youtube_id' => 's9kVG2ZaTS4',
                    'thumb' => 'https://img.youtube.com/vi/s9kVG2ZaTS4/hqdefault.jpg',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'titulo' => 'Pagode em Brasília',
                    'visualizacoes' => 5000000,
                    'youtube_id' => 'lpGGNA6_920',
                    'thumb' => 'https://img.youtube.com/vi/lpGGNA6_920/hqdefault.jpg',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'titulo' => 'Rio de Lágrimas',
                    'visualizacoes' => 153000,
                    'youtube_id' => 'FxXXvPL3JIg',
                    'thumb' => 'https://img.youtube.com/vi/FxXXvPL3JIg/hqdefault.jpg',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'titulo' => 'Tristeza do Jeca',
                    'visualizacoes' => 154000,
                    'youtube_id' => 'tRQ2PWlCcZk',
                    'thumb' => 'https://img.youtube.com/vi/tRQ2PWlCcZk/hqdefault.jpg',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'titulo' => 'Terra roxa',
                    'visualizacoes' => 3300000,
                    'youtube_id' => '4Nb89GFu2g4',
                    'thumb' => 'https://img.youtube.com/vi/4Nb89GFu2g4/hqdefault.jpg',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            ]);

        }

        public function down(): void {
            Schema::dropIfExists('musicas');
        }

    };

?>
