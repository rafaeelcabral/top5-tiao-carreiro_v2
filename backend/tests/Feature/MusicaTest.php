<?php

    use App\Models\Musica;
    use Illuminate\Foundation\Testing\RefreshDatabase;
    use Illuminate\Support\Facades\Http;

    uses(RefreshDatabase::class);

    //Teste => Listagem das 5 view mais vistas
    it('lista sempre as 5 musicas mais vistas', function () {

        Musica::factory()->count(10)->create();

        $expected = Musica::orderByDesc('visualizacoes')->take(5)->pluck('youtube_id')->toArray();

        $response = $this->getJson('/api/musicas')->assertOk()->json();

        $got = array_column($response, 'youtube_id');

        expect($got)->toEqual($expected);

    });

    //Teste => Inserindo uma URL inválida
    it('retorna 422 para url do youtube inválida', function () {

        Musica::truncate();

        $this->postJson('/api/musicas', ['url' => 'https://exemplo.com/watch?v=abc'])->assertStatus(422);

        $this->assertDatabaseCount('musicas', 0);

    });


    //Teste => Inserindo uma URL válida
    it('insere uma musica valida do youtube', function () {

        // Mock da página do YouTube
        Http::fake([
            'https://www.youtube.com/watch?v=ABC123xyz' => Http::response(
                '<title>Música Nova - YouTube</title><script>{"viewCount":"1234"}</script>',
                200
            )
        ]);

        // Executa o POST
        $this->postJson('/api/musicas', ['url' => 'https://www.youtube.com/watch?v=ABC123xyz'])->assertStatus(201);

        // Verifica se foi inserido no banco
        $this->assertDatabaseHas('musicas', [
            'youtube_id' => 'ABC123xyz',
            'titulo' => 'Música Nova',
            'visualizacoes' => 1234
        ]);

    });

?>
