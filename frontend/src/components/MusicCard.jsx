import axios from "axios";
import { useState } from "react";

function MusicCard({ music, rank, onUpdate, user }) {

    const token = user?.token; // pega token do user logado

    //Função de Aprovar a Música
    const approve = async () => {

        try {

            await axios.post(
                `http://localhost:8000/api/musicas/${music.id}/approve`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            onUpdate(); // Atualiza a lista no frontend

        } catch (err) {
            console.error(err.response?.data || err.message);
            alert(`Erro ao aprovar música: ${err.response?.data?.message || err.message}`);
        }


    };

    //Função de Reprovar a Música
    const reject = async () => {

        try {

            await axios.post(
                `http://localhost:8000/api/musicas/${music.id}/reject`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            onUpdate(); // Atualiza a lista no frontend

        } catch (err) {
            console.error(err.response?.data || err.message);
            alert(`Erro ao aprovar música: ${err.response?.data?.message || err.message}`);
        }

    };

    //Função de Remover a Música
    const remove = async () => {

        try {

            await axios.delete(
                `http://localhost:8000/api/musicas/${music.id}/remove`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            onUpdate(); // Atualiza a lista no frontend

        } catch (err) {
            console.error(err.response?.data || err.message);
            alert(`Erro ao deletar música: ${err.response?.data?.message || err.message}`);
        }

    };

    // Função para exibir status como texto
    const getStatusText = () => {
        if (music.aprovada === 1) return "Aprovado";
        if (music.aprovada === 0) return "Reprovado";
        return "Pendente";
    };

    // Classe CSS para cores
    const getStatusClass = () => {
        if (music.aprovada === 1) return "approved";
        if (music.aprovada === 0) return "rejected";
        return "pending";
    };

    console.log(music.aprovada);


    return (
        <div className="music-card-container">
            <a
                href={`https://www.youtube.com/watch?v=${music.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="music-card-link"
            >
                <div className="music-card">
                    <div className="rank">{rank}</div>
                    <div className="music-info">
                        <div className="music-title">{music.titulo}</div>
                        <div className="views">{music.visualizacoes} visualizações</div>
                        <div className={`status ${getStatusClass()}`}>{getStatusText()}</div>
                    </div>
                    <img
                        src={music.thumb}
                        alt={`Thumbnail ${music.titulo}`}
                        className="thumbnail"
                    />
                </div>
            </a>

            {/* Botões só aparecem se o usuário estiver logado */}
            {token && (
                <div className="admin-buttons">
                    {music.aprovada === null && (
                        <>
                            <button onClick={approve}>Aprovar</button>
                            <button onClick={reject}>Reprovar</button>
                        </>
                    )}
                    <button onClick={remove}>Deletar</button>
                </div>
            )}
        </div>
    );

}

export default MusicCard;
