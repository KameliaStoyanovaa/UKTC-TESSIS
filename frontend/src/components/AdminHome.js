import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const [user, setUser] = useState(null);
  const [enrolled, setEnrolled] = useState([]);
  const [unenrolled, setUnenrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        // 🔐 Проверка на потребителя и ролята
        const userRes = await fetch("http://localhost/UKTC-TESSIS/backend/src/routes/user.php", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const userText = await userRes.text();
        const userData = JSON.parse(userText);

        if (!userRes.ok || !userData.user || userData.user.role !== "admin") {
          navigate("/"); // не е админ => redirect
          return;
        }

        setUser(userData.user);

        // 🔄 Вземане на списъци
        const statusRes = await fetch(
          "http://localhost/UKTC-TESSIS/backend/src/routes/auth.php?action=get_status_lists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const rawText = await statusRes.text();
        console.log("RAW RESPONSE:", rawText);
        let statusData;
        try {
          statusData = JSON.parse(rawText);
        } catch (err) {
          console.error("❌ Неуспешен JSON парс:", rawText);
          return;
        }

        setEnrolled(statusData.enrolled || []);
        setUnenrolled(statusData.unenrolled || []);
      } catch (err) {
        console.error("💥 Грешка:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <p className="text-center mt-10 text-lg">Зареждане...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Админ Панел</h2>

      {/* Записани */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-green-700">📗 Записани студенти</h3>
        <StatusTable data={enrolled} />
      </div>

      {/* Отписани */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-red-700">📕 Отписани студенти</h3>
        <StatusTable data={unenrolled} />
      </div>
    </div>
  );
};

const StatusTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-500 italic">Няма записи</p>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg shadow">
      <table className="min-w-full table-auto text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">#</th>
            <th className="text-left p-3">Име</th>
            <th className="text-left p-3">Имейл</th>
            <th className="text-left p-3">Дата</th>
            <th className="text-left p-3">Локация</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={entry.id + "-" + index} className="border-t hover:bg-gray-50">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{entry.full_name}</td>
              <td className="p-3">{entry.email}</td>
              <td className="p-3">
                {entry.timestamp
                  ? new Date(entry.timestamp).toLocaleString()
                  : "-"}
              </td>
              <td className="p-3">{entry.location || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHome;
