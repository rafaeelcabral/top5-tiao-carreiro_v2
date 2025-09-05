import axios from "axios";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { useState } from "react";

function MusicCard({ music, rank, onUpdate, user, size = "normal" }) {

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

    // Ajustes de tamanho para ranks menores
    const isSmallRank = rank >= 6 && rank <= 10;

    const cardStyle = {
        maxWidth: isSmallRank ? "700px" : "850px",
    };

    const titleClass = isSmallRank ? "fw-bold fs-6" : "fw-bold fs-5";

    const rankClass = isSmallRank ? "me-2 fw-bold fs-5 text-primary" : "me-3 fw-bold fs-4 text-primary";

    return (

        <div className="card mb-3 shadow-sm mx-auto" style={cardStyle}>

            {/* link só cobre o conteúdo, não os botões */}
            <a
                href={`https://www.youtube.com/watch?v=${music.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-dark"
            >

                <div className="card-body d-flex align-items-center">

                    <div className={rankClass}>{rank}</div>

                    <div className="flex-grow-1">

                        <div className={titleClass}>{music.titulo}</div>

                        <div className="text-muted small">{music.visualizacoes} visualizações</div>

                        {token && (
                            <div className={getStatusClass()}>
                                {getStatusText()}
                            </div>
                        )}

                    </div>

                    <img
                        src={music.thumb}
                        alt={`Thumbnail ${music.titulo}`}
                        className="img-thumbnail"
                        style={{
                        width: isSmallRank ? "100px" : "120px",
                        height: isSmallRank ? "65px" : "80px",
                        objectFit: "cover",
                        }}
                    />

                </div>

            </a>

            {token && (

                <div className="card-footer bg-white border-top d-flex gap-2">

                    {music.aprovada === null && (
                        <>

                            <button className="btn btn-success btn-sm d-flex align-items-center gap-1" onClick={approve}>
                                <FaCheck /> Aprovar
                            </button>

                            <button className="btn btn-warning btn-sm d-flex align-items-center gap-1" onClick={reject}>
                                <FaTimes /> Reprovar
                            </button>

                        </>
                    )}

                    <button className="btn btn-danger btn-sm d-flex align-items-center gap-1" onClick={remove}>
                        <FaTrash /> Deletar
                    </button>

                </div>

            )}

        </div>

    );

}

export default MusicCard;
