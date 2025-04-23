import React, { useEffect, useState } from "react";
import { getUserInfo } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

const Account = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      getUserInfo(token).then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      });
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-lg text-gray-600">
        Зареждане...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#791c1c] flex flex-col items-center pt-6 px-4 text-black">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-sm p-6 relative">
        {/* Назад бутон */}
        <button
          className="absolute left-4 top-4 text-black text-xl"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
        </button>

        {/* Профил снимка */}
        <div className="flex justify-center mb-4 mt-4">
          <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center text-4xl">
            <FaUser />
          </div>
        </div>

        {/* Данни */}
        <div className="space-y-4 text-center">
          <p className="text-xl font-semibold flex justify-center items-center gap-2">
            <FaUser /> {user.full_name}
          </p>
          <p className="text-md text-gray-700 flex justify-center items-center gap-2">
            <FaEnvelope /> {user.email}
          </p>
          <p className="text-md text-gray-700 flex justify-center items-center gap-2">
            <FaCalendarAlt /> {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Account;
