<?php

    namespace App\Http\Controllers;

    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Http;
    use Illuminate\Support\Facades\Validator;
    use Laravel\Sanctum\PersonalAccessToken;
    use App\Models\Musica;

    class MusicaController extends Controller {
        
        // Retorna músicas por ordem de vizualizações
        public function index(Request $request) {

            $query = Musica::query();

            $user = null;

            // Checa token manualmente
            $token = $request->bearerToken();
            if ($token) {
                $accessToken = PersonalAccessToken::findToken($token);
                if ($accessToken) {
                    $user = $accessToken->tokenable; // recupera o usuário
                }
            }

            $perPage = $request->get('per_page', 10); // controla o tamanho da página

            if ($user) {

                $musicas = $query->orderByDesc('visualizacoes')->paginate($perPage);

            } else {

                $musicas = $query->where('aprovada', true)->orderByDesc('visualizacoes')->paginate($perPage);

            }

            return response()->json($musicas);

        }


        /* Função responsável por:
             1 - Receber a url passada na requisição;
             2 - Validar se é uma url válida;
             3 - Extrair o ID da url passada na requisição; (via exctractVideoId($url))
             4 - Buscar Informações do vídeo; (via getVideoInfo($videoId))
             5 - Salvar no Banco de Dados
        */
        public function store(Request $request) {

            // Validação básica
            $validator = Validator::make($request->all(), [
                'url' => 'required|url'
            ]);

            if($validator->fails()) {
                return response()->json([
                    'error' => 'URL inválida.'
                ], 422);
            }

            //----------------

            $url = $request->input('url');

            //----------------

            // Extrai o ID do vídeo do YouTube
            $videoId = $this->extractVideoId($url);

            if(!$videoId) {
                return response()->json([
                    'error' => 'URL do YouTube inválida.'
                ], 422);
            }

            //----------------

            try {

                // Busca informações do vídeo (título, views, thumb)
                $videoInfo = $this->getVideoInfo($videoId);

                // Salva no banco
                $musica = Musica::create($videoInfo);

                return response()->json([
                    'success' => true,
                    'musica' => $musica
                ], 201);

            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Erro ao processar vídeo: ' . $e->getMessage()
                ], 500);
            }

        }

        //--------------------------------------------------------------------------------------------

        // Função privada(usada em store()) que extrai o ID da url passada na requisição
        private function extractVideoId($url) {

            $videoId = null;

            $patterns = [
                '/youtube\.com\/watch\?v=([^&]+)/',  // youtube.com/watch?v=ID
                '/youtu\.be\/([^?]+)/',              // youtu.be/ID
                '/youtube\.com\/embed\/([^?]+)/'     // youtube.com/embed/ID
            ];

            foreach ($patterns as $pattern) {
                if (preg_match($pattern, $url, $matches)) {
                    $videoId = $matches[1];
                    break;
                }
            }

            return $videoId;

        }


        // Função privada(usada em store()) que busca informações do video passado pela url de acordo com ID dela
        private function getVideoInfo($videoId) {

            $url = "https://www.youtube.com/watch?v=" . $videoId;

            // Busca a url montada usando HTTP client do Laravel
            $response = Http::withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            ])->get($url)->body();

            // Extrai título (se não achar lança uma exceção)
            if (!preg_match('/<title>(.+?) - YouTube<\/title>/', $response, $titleMatches)) {
                throw new \Exception("Não foi possível encontrar o título do vídeo");
            }
            $title = html_entity_decode($titleMatches[1], ENT_QUOTES);

            // Extrai visualizações (se não achar $views assume '0')
            if (preg_match('/"viewCount":\s*"(\d+)"/', $response, $viewMatches)) {
                $views = (int)$viewMatches[1];
            } else if (preg_match('/"viewCount"\s*:\s*{.*?"simpleText"\s*:\s*"([\d,\.]+)"/', $response, $viewMatches)) {
                $views = (int)str_replace(['.', ','], '', $viewMatches[1]);
            } else {
                $views = 0;
            }

            // Retorna um array com os dados q devem ser inseridos no Banco
            return [
                'titulo' => $title,
                'visualizacoes' => $views,
                'youtube_id' => $videoId,
                'thumb' => 'https://img.youtube.com/vi/'.$videoId.'/hqdefault.jpg',
                'aprovada' => null
            ];

        }

        //--------------------------------------------------------------------------------------------

        public function approve($id) {

            $musica = Musica::findOrFail($id);

            $musica->aprovada = true;

            $musica->save();

            return response()->json(['message' => 'Música aprovada com sucesso']);

        }

        public function reject($id) {

            $musica = Musica::findOrFail($id);

            $musica->aprovada = false;

            $musica->save();

            return response()->json(['message' => 'Música rejeitada com sucesso']);
            
        }

        public function remove($id) {

            $musica = Musica::findOrFail($id);

            $musica->delete();

            return response()->json(['message' => 'Música removida com sucesso']);
            
        }

    }

?>
