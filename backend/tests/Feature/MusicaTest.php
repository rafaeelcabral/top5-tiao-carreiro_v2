<?php

    use App\Models\Musica;
    use App\Models\User;
    use Illuminate\Foundation\Testing\RefreshDatabase;
    use Illuminate\Support\Facades\Http;

    uses(RefreshDatabase::class);

    // Teste => Retorna apenas as músicas aprovadas
    it('retorna apenas as músicas aprovadas', function () {
        Musica::truncate(); // limpa a tabela antes do teste

        // Criar músicas aprovadas e não aprovadas
        Musica::factory()->create(['aprovada' => 1]);
        Musica::factory()->create(['aprovada' => 0]);
        Musica::factory()->create(['aprovada' => 0]);
        Musica::factory()->create(['aprovada' => null]);

        $response = $this->getJson('/api/musicas'); // rota da API

        $response->assertOk();

        // Extrair campo 'aprovada' do retorno
        $aprovadas = array_column($response['data'], 'aprovada');

        // Verifica se todas são 1
        foreach ($aprovadas as $aprovada) {
            expect($aprovada)->toBe('1');
        }
    });

    // Teste => Inserindo uma URL inválida
    it('retorna 422 para url do youtube inválida', function () {

        Musica::truncate();

        $this->postJson('/api/musicas', ['url' => 'https://exemplo.com/watch?v=abc'])->assertStatus(422);

        $this->assertDatabaseCount('musicas', 0);

    });

    // Teste => Inserindo uma URL válida
    it('insere uma musica valida do youtube', function () {
        Http::fake([
            'https://www.youtube.com/watch?v=ABC123xyz' => Http::response(
                '<title>Música Nova - YouTube</title><script>{"viewCount":"1234"}</script>',
                200
            )
        ]);

        $this->postJson('/api/musicas', ['url' => 'https://www.youtube.com/watch?v=ABC123xyz'])
            ->assertStatus(201);

        $this->assertDatabaseHas('musicas', [
            'youtube_id' => 'ABC123xyz',
            'titulo' => 'Música Nova',
            'visualizacoes' => 1234
        ]);
    });

    // Teste => Aprovar música
    it('aprova uma musica existente', function () {
        $musica = Musica::factory()->create(['aprovada' => null]);

        $user = User::factory()->create();

        $this->actingAs($user)
             ->postJson("/api/musicas/{$musica->id}/approve")
             ->assertOk()
             ->assertJson(['message' => 'Música aprovada com sucesso']);

        $this->assertDatabaseHas('musicas', [
            'id' => $musica->id,
            'aprovada' => '1',
        ]);
    });

    // Teste => Rejeitar música
    it('rejeita uma musica existente', function () {
        $musica = Musica::factory()->create(['aprovada' => null]);

        $user = User::factory()->create();

        $this->actingAs($user)
             ->postJson("/api/musicas/{$musica->id}/reject")
             ->assertOk()
             ->assertJson(['message' => 'Música rejeitada com sucesso']);

        $this->assertDatabaseHas('musicas', [
            'id' => $musica->id,
            'aprovada' => '0',
        ]);
    });

    // Teste => Deletar música
    it('deleta uma musica existente', function () {
        $musica = Musica::factory()->create();

        $user = User::factory()->create();

        $this->actingAs($user)
             ->deleteJson("/api/musicas/{$musica->id}/remove")
             ->assertOk()
             ->assertJson(['message' => 'Música removida com sucesso']);

        $this->assertDatabaseMissing('musicas', [
            'id' => $musica->id,
        ]);
    });

?>