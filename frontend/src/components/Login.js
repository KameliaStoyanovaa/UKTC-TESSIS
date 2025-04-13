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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800">
            <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md flex flex-col items-center">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Login</h2>
                <div className="w-full mb-6 text-gray-500 text-lg flex justify-center space-x-4">
    
                </div>
                <form onSubmit={handleLogin} className="space-y-6 w-full">
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-300"
                    >
                        Login
                    </button>
                </form>
                <div className="text-sm mt-4 flex justify-between w-full">
                    <a href="/forgot-password" className="text-red-500 hover:underline">
                        Forgot Password?
                    </a>
                    <a href="/register" className="text-red-500 hover:underline">
                        Don't have an account? Sign Up
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
