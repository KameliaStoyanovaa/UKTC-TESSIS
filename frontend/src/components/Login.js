import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const data = await login(email, password);

    if (data?.token) {
      localStorage.setItem("token", data.token);
      console.log(data.token);
      try {
        const res = await fetch("http://localhost/UKTC-TESSIS/backend/src/routes/user.php", {
          headers: {
            Authorization: `Bearer ${data.token}`,
            Accept: "application/json",
          },
        });

        const text = await res.text();
        console.log("Отговор от user.php:", text);

        let result;
        try {
          result = JSON.parse(text);
        } catch (err) {
          throw new Error("Сървърът не върна валиден JSON.");
        }

        if (res.ok && result.user) {
          const role = result.user.role;
          navigate(role === "admin" ? "/admin" : "/account");
        } else {
          setError("Неуспешно извличане на потребителска информация.");
        }
      } catch (err) {
        console.error("Грешка при извличане на роля:", err);
        setError("Възникна грешка при проверката на роля.");
      }
    } else {
      setError("Грешен email или парола.");
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Вход в системата</h2>

          <form onSubmit={handleLogin} className="space-y-6 w-full">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
                type="password"
                placeholder="Парола"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <button
                type="submit"
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-300"
            >
              Вход
            </button>
          </form>

          {error && (
              <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
          )}

          <div className="text-sm mt-6 flex justify-between w-full">
            <a href="/forgot-password" className="text-red-500 hover:underline">
              Забравена парола?
            </a>
            <a href="/register" className="text-red-500 hover:underline">
              Нямаш акаунт? Регистрация
            </a>
          </div>
        </div>
      </div>
  );
};

export default Login;
