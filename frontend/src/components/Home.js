import React, { useState, useEffect } from "react";

const UpdateStatus = () => {
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState(""); // 👈
  const [lastStatus, setLastStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost/UKTC-TESSIS/backend/src/routes/user.php", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const text = await response.text();
        const data = JSON.parse(text);

        if (response.ok && data.user) {
          setUserId(data.user.id);
          setFullName(data.user.full_name);
          setLastStatus(data.user.last_status || "");
        } else {
          setMessage("Неуспешно зареждане на потребителя.");
        }
      } catch (error) {
        console.error("Грешка:", error);
        setMessage("Грешка при зареждане на потребителя.");
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!status) {
      setMessage("Моля, изберете статус.");
      return;
    }

    if (status === "unenrolled" && location.trim() === "") {
      setMessage("Моля, въведете локация за отписване.");
      return;
    }

    const payload = {
      userId,
      status,
      ...(status === "unenrolled" && { location }), // изпращаме само ако трябва
    };

    const res = await fetch("http://localhost/UKTC-TESSIS/backend/src/routes/auth.php?action=update_status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    setMessage(result.message);
    if (res.ok) {
      setLastStatus(status);
      setLocation(""); // нулирай локацията
    }
  };

  const canSubmit = () => {
    if (!status) return false;
    if (lastStatus === status) return false;
    if (status === "unenrolled" && location.trim() === "") return false;
    return true;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Актуализиране на статус</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Здравей,</label>
        <input
          type="text"
          value={fullName}
          readOnly
          className="w-full p-2 bg-gray-100 rounded font-semibold"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Статус:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">-- избери статус --</option>
          <option value="enrolled">Записан</option>
          <option value="unenrolled">Отписан</option>
        </select>
      </div>

      {/* 👇 показваме поле за локация само при отписване */}
      {status === "unenrolled" && (
        <div className="mb-4">
          <label className="block text-gray-700">Локация при отписване:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Пример: София, Варна ..."
          />
        </div>
      )}

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={!canSubmit()}
        className={`w-full py-2 px-4 rounded text-white transition ${
          canSubmit() ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Потвърди
      </button>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default UpdateStatus;
