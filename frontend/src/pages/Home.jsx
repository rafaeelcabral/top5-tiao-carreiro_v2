import { useEffect, useState } from "react";
import axios from "axios";
import Login from "../components/Login";
import Header from "../components/Header";
import SubmitForm from "../components/SubmitForm";
import MusicCard from "../components/MusicCard";

function Home() {

    const [musicas, setMusicas] = useState([]);
    const [user, setUser] = useState(null);
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10); // ajusta se quiser
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);

    // Função para buscar músicas; aceita token opcional
    const fetchMusicas = async (token = null, pageToFetch = 1) => {

        try {

            setLoading(true);

            const headers = {};

            if (token) headers.Authorization = `Bearer ${token}`;

            const response = await axios.get("http://localhost:8000/api/musicas", {
                headers,
                params: { page: pageToFetch, per_page: perPage },
            });

            const data = response.data;

            // Caso o backend retorne o objeto de paginação do Laravel: { data: [...], current_page, last_page, total, ... }
            if (data && data.data && Array.isArray(data.data)) {

                setMusicas(data); // guardamos o objeto completo

                setMeta({
                    current_page: data.current_page || pageToFetch,
                    last_page: data.last_page || 1,
                    total: data.total || data.data.length,
                });

            } else if (Array.isArray(data)) {

                // backend sem paginação (array simples)
                setMusicas(data);

                setMeta({
                    current_page: 1,
                    last_page: Math.max(1, Math.ceil(data.length / perPage)),
                    total: data.length,
                });

                setPage(1);

            } else {

                // fallback defensivo
                const arr = Array.isArray(data?.data) ? data.data : [];

                setMusicas(arr);

                setMeta({
                    current_page: data?.current_page || 1,
                    last_page: data?.last_page || Math.max(1, Math.ceil(arr.length / perPage)),
                    total: data?.total || arr.length,
                });

                setPage(data?.current_page || 1);

            }

        } catch (error) {

            console.error("Erro ao buscar músicas:", error);

        } finally {

            setLoading(false);

        }

    };

    // Ao montar o componente, tenta pegar token do localStorage
    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token) {

            setUser({ token });

            fetchMusicas(token, page); // busca com token

        } else {

            fetchMusicas(null, page); // busca sem token

        }

    }, [page]);

    const handleLoginSuccess = (userData) => {
        // userData já tem token
        setUser(userData);
        setShowLoginForm(false);
        setPage(1);
        fetchMusicas(userData.token); // atualiza lista com token
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setPage(1);
        setShowLoginForm(true); 
        fetchMusicas(); // busca músicas sem token
    };

    // Se o estado `musicas` for um objeto paginado, extraímos o array, senão usamos o próprio array.
    const lista = Array.isArray(musicas) ? musicas : (musicas?.data ?? []);

    return (

        <div class='bg-light'>

            <Header />

            <div className="container py-4">

                {/* Login */}
                {showLoginForm && !user && <Login onLogin={handleLoginSuccess} />}

                {/* Usuário logado */}
                {user && (
                    <div className="alert alert-info d-flex justify-content-between align-items-center mx-auto mb-5" style={{ maxWidth: "850px" }}>

                        <span>🎶 Olá, você está logado!</span>

                        <button
                        onClick={handleLogout}
                        className="btn btn-outline-danger btn-sm"
                        >
                            Logout
                        </button>

                    </div>
                )}

                {/* Formulário de envio */}
                <SubmitForm onNewMusica={() => fetchMusicas(user?.token, page)} />

                <h3 className="text-center my-4">Ranking Atual</h3>

                {/* Loading */}
                {loading ? (

                    <div className="d-flex justify-content-center my-4">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>

                ) 
                :
                lista.length === 0 ? (

                    /* Músicas = 0 */
                    <div className="card text-center p-4 mx-auto" style={{ maxWidth: "850px" }}>

                        <div className="display-3">🎵</div>

                        <h5 className="mt-3">Nenhuma música cadastrada ainda</h5>

                        <p className="text-muted">
                        Seja o primeiro a sugerir uma música usando o formulário acima!
                        </p>

                    </div>

                ) 
                : 
                (
                    <>
                        {/* Top 5 */}
                        <div className="d-flex flex-column gap-3 mb-4">

                            {lista.slice(0, 5).map((item, index) => (

                                <div key={item.id} className="col">

                                    <MusicCard
                                        music={item}
                                        rank={(page - 1) * perPage + (index + 1)}
                                        onUpdate={() => fetchMusicas(user?.token, page)}
                                        user={user}
                                        size="large"
                                    />

                                </div>
                            ))}

                        </div>

                        {/* 6 a 10 */}
                        <div className="d-flex flex-column gap-3 mb-4">

                            {lista.slice(5, 10).map((item, index) => (

                                <div key={item.id} className="col">

                                    <MusicCard
                                        music={item}
                                        rank={(page - 1) * perPage + (index + 6)}
                                        onUpdate={() => fetchMusicas(user?.token, page)}
                                        user={user}
                                        size="medium"
                                    />

                                </div>

                            ))}

                        </div>

                        {/* Paginação */}
                        {(musicas?.last_page > 1 || lista.length > 10) && (

                            <div className="d-flex flex-column gap-3 mb-4 mx-auto align-items-center" style={{ maxWidth: "200px" }}>

                                <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                >
                                    Anterior
                                </button>

                                <span>
                                    Página {page}{" "}
                                    {meta.last_page ? `de ${meta.last_page}` : ""}
                                </span>

                                <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() =>setPage((p) =>meta.last_page ? Math.min(meta.last_page, p + 1) : p + 1)}
                                disabled={meta.last_page ? page >= meta.last_page : false}
                                >
                                    Próxima
                                </button>

                            </div>
                        )}

                    </>

                )}

            </div>

        </div>

    );

}

export default Home;
