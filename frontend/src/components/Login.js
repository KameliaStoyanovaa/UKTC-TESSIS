import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = await login(email, password);
        if (data.token) {
            localStorage.setItem("token", data.token);
            navigate("/");
        } else {
            alert("Грешен email или парола");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Парола" onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Вход</button>
            </form>
        </div>
    );
};

export default Login;
