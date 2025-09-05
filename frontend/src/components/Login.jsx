import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post("http://localhost:8000/api/login", { email, password });

            const token = res.data.access_token;

            localStorage.setItem("token", token);

            // envia o token junto com o user
            onLogin({ ...res.data.user, token });

        } catch (err) {

            alert("Credenciais inválidas");

        }

    };

    return (

        <div className="card shadow-sm mb-5 mx-auto" style={{ maxWidth: "350px" }}>

            <div className="card-body">

                <h5 className="card-title text-center mb-3">Login</h5>

                <form onSubmit={handleLogin}>

                    <div className="mb-3">

                        <label htmlFor="email" className="form-label">
                            Email
                        </label>

                        <input
                        id="email"
                        type="email"
                        className="form-control"
                        placeholder="Digite seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />

                    </div>

                    <div className="mb-3">

                        <label htmlFor="password" className="form-label">
                            Senha
                        </label>

                        <input
                        id="password"
                        type="password"
                        className="form-control"
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />

                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Entrar
                    </button>

                </form>

            </div>

        </div>

    );

}

export default Login;
