import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaUserSlash } from "react-icons/fa";

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
      <h1 className="text-4xl font-bold text-center mb-12">Админ Панел</h1>

      {/* Записани */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
          <FaUserGraduate className="text-green-600" /> Записани студенти
        </h2>
        <StatusTable data={enrolledList} showLocation={false} />
      </section>

      {/* Отписани */}
      <section>
        <h2 className="text-2xl font-semibold text-red-700 mb-4 flex items-center gap-2">
          <FaUserSlash className="text-red-600" /> Отписани студенти
        </h2>
        <StatusTable data={unenrolledList} showLocation={true} />
      </section>
    </div>
  );
};

const StatusTable = ({ data, showLocation }) => {
  if (!data.length) {
    return <p className="italic text-gray-500 text-sm">Няма налични записи.</p>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="min-w-full table-auto text-sm bg-white">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="text-left p-3">#</th>
            <th className="text-left p-3">Име</th>
            <th className="text-left p-3">Имейл</th>
            <th className="text-left p-3">Дата</th>
            {showLocation && <th className="text-left p-3">Локация</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={entry.id + "_" + idx} className="border-t hover:bg-gray-50 transition">
              <td className="p-3">{idx + 1}</td>
              <td className="p-3 font-medium">{entry.full_name}</td>
              <td className="p-3">{entry.email}</td>
              <td className="p-3">
                {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "-"}
              </td>
              {showLocation && (
                <td className="p-3">{entry.location || "-"}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHome;
