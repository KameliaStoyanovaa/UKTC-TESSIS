import React, { useEffect, useState } from "react";
import { getUserInfo } from "../api/auth";

const Home = () => {
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
            <h2>Home</h2>
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

export default Home;
