import React, { useEffect, useState } from "react";
import { getUserInfo } from "../api/auth";

const Account = () => {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            getUserInfo(token).then((data) => {
                if (data.user) {
                    setUser(data.user);
                } else {
                    localStorage.removeItem("token");
                }
            });
        }
    }, [token]);

    return (
        <div>
            <h2>Account Page</h2>
            <div className="bg-green-500 text-white p-4 rounded-lg">
  Tailwind работи! 🍃
</div>

            {user ? (
                <div>
                    <p>Име: {user.full_name}</p>
                    <p>Email: {user.email}</p>
                    <p>Timestamp: {user.created_at}</p>
                </div>
            ) : (
                <p>Моля, влезте в системата.</p>
            )}
        </div>
    );
};

export default Account;
