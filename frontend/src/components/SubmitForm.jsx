import { useState } from "react";

function SubmitForm({ onNewMusica }) {

    const [url, setUrl] = useState("");
    const [error, setError] = useState(""); // estado para mensagem de erro

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError(""); 

        try {

            const res = await fetch("http://127.0.0.1:8000/api/musicas", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();

            console.log("Resposta:", data);

            // Se o backend retornou erro, exibe mensagem
            if (!res.ok) {
                setError(data.error || "Ocorreu um erro ao processar a URL.");
                return;
            }

            // Recarregar lista após inserir
            const rankingRes = await fetch("http://127.0.0.1:8000/api/musicas");
            const ranking = await rankingRes.json();
            onNewMusica(ranking);

            setUrl("");

        } catch (e) {

            console.error(e);

        }

    }
    
    return (

        <div className="submit-form">

            <h3>Sugerir Nova Música</h3>

            <form onSubmit={handleSubmit}>

                {error && <div className="error-message">{error}</div>}

                <div className="input-group">

                    <input
                        type="url"
                        placeholder="Cole aqui o link do YouTube"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />

                    <button type="submit" className="submit-button">
                        Enviar Link
                    </button>

                </div>

            </form>

        </div>
    )

}

export default SubmitForm;
