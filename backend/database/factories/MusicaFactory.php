<?php

    namespace Database\Factories;

    use App\Models\Musica;
    use Illuminate\Database\Eloquent\Factories\Factory;

    class MusicaFactory extends Factory {

        protected $model = Musica::class;

        public function definition() {

            return [
                'titulo' => $this->faker->sentence(3),
                'youtube_id' => $this->faker->regexify('[A-Za-z0-9_-]{11}'),
                'visualizacoes' => $this->faker->numberBetween(0, 1000000),
                'thumb' => $this->faker->imageUrl(480, 360, 'music', true),
            ];

        }
        
    }

?>
