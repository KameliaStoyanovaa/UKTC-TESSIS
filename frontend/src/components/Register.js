import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {register} from "../api/auth";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const data = await register(name, email, password, role);
        if (data.token) {
            localStorage.setItem("token", data.token);
            navigate("/");
        } else {
            alert("Грешка при регистрация");
        }
    };

    return (<div>
            <h2>Регистрация</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Име" onChange={(e) => setName(e.target.value)} required/>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required/>
                <input type="password" placeholder="Парола" onChange={(e) => setPassword(e.target.value)} required/>
                <label htmlFor="role">Изберете роля:</label>
                <select id="role" name="role" onChange={(e) => setRole(e.target.value)} required>
                    <option value="admin">Администратор</option>
                    <option value="student">Студент</option>
                </select>
                <button type="submit">Регистрация</button>
            </form>
        </div>);
};

export default Register;
