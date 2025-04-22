import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";

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

  return (
    <div className="min-h-screen bg-[#791c1c] flex items-center justify-center px-4">
      <div className="bg-white rounded-t-3xl p-6 w-full max-w-md shadow-lg">
        {/* Заглавие */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-4xl font-bold text-black">Sign Up</h2>
          <button className="text-red-600 text-2xl">&times;</button>
        </div>
        <p className="mb-6 text-sm">
          Already registered?{" "}
          <a href="/login" className="font-semibold underline">
            Log in
          </a>
        </p>

        {/* Формата */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">👤</span>
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded-md pl-10 pr-4 py-2 focus:outline-none"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">✉️</span>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-md pl-10 pr-4 py-2 focus:outline-none"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">🔒</span>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-md pl-10 pr-4 py-2 focus:outline-none"
            />
          </div>
          <div className="mt-2">
            <label htmlFor="role" className="text-sm font-semibold">
              Изберете роля:
            </label>
            <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full border mt-1 rounded-md px-3 py-2"
            >
              <option value="admin">Администратор</option>
              <option value="student">Студент</option>
            </select>
          </div>

          {/* Бутон */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-black text-white rounded-md px-6 py-2 text-xl hover:bg-gray-800 transition"
            >
              ➜
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
