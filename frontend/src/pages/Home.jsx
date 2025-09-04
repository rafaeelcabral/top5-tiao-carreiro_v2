import { useEffect, useState } from "react";
import axios from "axios";
import Login from "../components/Login";
import Header from "../components/Header";
import SubmitForm from "../components/SubmitForm";
import MusicCard from "../components/MusicCard";

function Home() {
    const [musicas, setMusicas] = useState([]);
    const [user, setUser] = useState(null);
    const [showLoginForm, setShowLoginForm] = useState(false);

    // Função para buscar músicas; aceita token opcional
    const fetchMusicas = async (token = null) => {

        try {

            const headers = {};

            if (token) headers.Authorization = `Bearer ${token}`;

            const response = await axios.get("http://localhost:8000/api/musicas", { headers });

            setMusicas(response.data);

        } catch (error) {

            console.error("Erro ao buscar músicas:", error);

        }

    };

    // Ao montar o componente, tenta pegar token do localStorage
    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token) {

            setUser({ token });

            fetchMusicas(token); // busca com token

        } else {

            fetchMusicas(); // busca sem token

        }

    }, []);

    const handleLoginClick = () => {
        setShowLoginForm(true);
    };

    const handleLoginSuccess = (userData) => {
        // userData já tem token
        setUser(userData);
        setShowLoginForm(false);
        fetchMusicas(userData.token); // atualiza lista com token
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        fetchMusicas(); // busca músicas sem token
    };

    return (

        <div>

            <Header />

            <div className="container">

                {/* Abrir Formulário de Login */}
                {!user && !showLoginForm && (
                    <button onClick={handleLoginClick} className="login-btn">
                        Login
                    </button>
                )}

                {/* Formulário de Login */}
                {showLoginForm && !user && (
                    <Login onLogin={handleLoginSuccess} />
                )}

                {/* Usuário Logado */}
                {user && (
                    <div className="logout-section">
                        <p>Olá, você está logado!</p>
                        <button onClick={handleLogout} className="logout-btn">
                        Logout
                        </button>
                    </div>
                )}

                <SubmitForm onNewMusica={setMusicas} />

                <h3 className="section-title">Ranking Atual</h3>

                {musicas.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🎵</div>
                        <div className="empty-state-text">Nenhuma música cadastrada ainda</div>
                        <div className="empty-state-subtext">
                        Seja o primeiro a sugerir uma música usando o formulário acima!
                        </div>
                    </div>
                ) : (
                    musicas.map((item, index) => (
                        <MusicCard
                        key={item.id}
                        music={item}
                        rank={index + 1}
                        onUpdate={() => fetchMusicas(user?.token)}
                        user={user}
                        />
                    ))
                )}

            </div>

        </div>

    );
}

export default Home;
