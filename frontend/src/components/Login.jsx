import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {

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

        <form onSubmit={handleLogin}>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>

        </form>
        
    );
}
