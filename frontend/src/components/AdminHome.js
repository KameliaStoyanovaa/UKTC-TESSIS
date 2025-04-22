import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const [user, setUser] = useState(null);
  const [enrolledList, setEnrolledList] = useState([]);
  const [unenrolledList, setUnenrolledList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchAdminData = async () => {
      try {
        // 🔐 Проверка на потребителя
        const userRes = await fetch("http://localhost/UKTC-TESSIS/backend/src/routes/user.php", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const userText = await userRes.text();
        const userData = JSON.parse(userText);

        if (!userData.user || userData.user.role !== "admin") {
          return navigate("/");
        }

        setUser(userData.user);

        // 📦 Вземане на записи за седмицата
        const statusRes = await fetch(
            "http://localhost/UKTC-TESSIS/backend/src/routes/auth.php?action=get_week_records",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
        );

        const raw = await statusRes.text();
        console.log("📦 Суров отговор:", raw);

        let records = [];

        try {
          if (raw.trim().startsWith("{") || raw.trim().startsWith("[")) {
            records = JSON.parse(raw);
          } else {
            console.warn("⚠️ Получен отговор не е JSON:", raw);
          }
        } catch (err) {
          console.error("❌ JSON parse error:", err);
        }


        const enrolled = records.filter((r) => r.status === "enrolled");
        const unenrolled = records.filter((r) => r.status === "unenrolled");

        setEnrolledList(enrolled);
        setUnenrolledList(unenrolled);
      } catch (err) {
        console.error("❌ Грешка при зареждане на админ данни:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  if (loading) return <p className="text-center mt-10 text-lg">Зареждане...</p>;

  return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-10">Админ Панел</h1>

        {/* Записани */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-700 mb-4">📗 Записани студенти</h2>
          <StatusTable data={enrolledList} />
        </section>

        {/* Отписани */}
        <section>
          <h2 className="text-xl font-semibold text-red-700 mb-4">📕 Отписани студенти</h2>
          <StatusTable data={unenrolledList} />
        </section>
      </div>
  );
};

const StatusTable = ({ data }) => {
  if (!data.length) {
    return <p className="italic text-gray-500 text-sm">Няма налични записи.</p>;
  }

  return (
      <div className="overflow-x-auto border rounded shadow">
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
          {data.map((entry, idx) => (
              <tr key={entry.id + "_" + idx} className="border-t hover:bg-gray-50">
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">{entry.full_name}</td>
                <td className="p-3">{entry.email}</td>
                <td className="p-3">{new Date(entry.timestamp).toLocaleString()}</td>
                <td className="p-3">{entry.location || "-"}</td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default AdminHome;
