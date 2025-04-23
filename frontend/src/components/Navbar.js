import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-[#791c1c] shadow text-white px-6 py-3 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/" className="hover:text-gray-200 transition"></Link>
      </div>

      <div className="flex gap-4 items-center">
        {!token ? (
          <>
            <Link
              to="/login"
              className="hover:text-gray-200 transition font-medium"
            >
              Вход
            </Link>
            <Link
              to="/register"
              className="hover:text-gray-200 transition font-medium"
            >
              Регистрация
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/"
              className="hover:text-gray-200 transition font-medium"
            >
              Начало
            </Link>
            <Link
              to="/account"
              className="hover:text-gray-200 transition font-medium"
            >
              Акаунт
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-[#791c1c] font-semibold px-3 py-1 rounded hover:bg-gray-200 transition"
            >
              Излез
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
