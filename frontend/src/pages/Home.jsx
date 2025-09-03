import { useEffect, useState } from "react";
import Header from "../components/Header";
import SubmitForm from "../components/SubmitForm";
import MusicCard from "../components/MusicCard";

function Home() {

    const [musicas, setMusicas] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/musicas")
        .then(res => res.json())
        .then(data => setMusicas(data))
        .catch(err => console.error(err));
    }, []);

    return (

        <div>

            <Header />

            <div className="container">

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

                        <MusicCard key={item.id} music={item} rank={index + 1} />

                    ))

                )}

            </div>
            
        </div>

    );

}

export default Home;