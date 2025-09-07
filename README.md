# Projeto Top 5 Tião Carreiro Versão 2

## Visão Geral
Este projeto é uma aplicação web que exibe as músicas mais vista do Youtube por ordem de vizualizações. Usuários podem sugerir novas músicas informando links válidos do YouTube, porém elas so irão aparecer se for aprovado por um Usuário autenticado. O backend é desenvolvido em Laravel e o frontend em ReactJS.

## Estrutura do Projeto
O projeto está dividido em dois diretórios principais: `backend` e `frontend`.

### Backend
- **Framework**: Laravel v11

- **Principais Funcionalidades**:

  - **Rotas da API**: Gerenciam as operações de listagem, sugestão, aprovação, rejeição e remoção de músicas e também Login de Usuário.
      - GET /musicas
      - POST /musicas {url}

      - POST /login {email, senha}

      Middleware Sanctum {token}
      - POST /logout
      - POST musicas/{id}/approve
      - POST musicas/{id}/reject
      - DELETE musicas/{id}/remove

  - **Controllers**: Controlam a lógica de negócio para manipulação das músicas e sugestões.
      - MusicaController
      - AuthController

  - **Models**: Representam as entidades do banco de dados, como músicas e Usuários.
      - Musica
      - User
  
  - **Testes Automatizados**: Os testes automatizados do backend foram desenvolvidos utilizando o Pest, uma ferramenta moderna e simples para testes em Laravel. Os testes cobrem as principais rotas e regras de negócio da API, garantindo que as funcionalidades estejam funcionando corretamente. Os arquivos de teste estão localizados na pasta `tests/` e utilizam uma sintaxe limpa e expressiva, facilitando a escrita e manutenção dos testes.

### Frontend
- **Framework**: ReactJS

- #### Principais Funcionalidades:

   - **Components**: Componentes reutilizáveis para exibição das músicas, formulário de sugestão e notificações.
      - Header.jsx
      - Login.jsx
      - SubmitForm.jsx  
      - MusicCard.jsx

   - **Page**: Página principal que integra os componentes e realiza a comunicação com a API do backend.
      - Home.jsx

## Utilização com Docker
Tanto o backend quanto o frontend são containerizados com Docker, garantindo ambiente de desenvolvimento consistente.

### Como Executar a Aplicação
1. **Clone o repositório**:
   ```bash
   git clone https://github.com/rafaeelcabral/top5-tiao-carreiro_v2.git
   ```

2. **Acesse o diretório do backend**:
   ```bash
   cd backend
   ```

3. **Construa e execute os containers**:
   ```bash
   docker-compose up --build
   ```

4. **Acesse a aplicação**:
   Abra o navegador em `http://localhost:3000` para o frontend e `http://localhost:8000` para a API do backend.

