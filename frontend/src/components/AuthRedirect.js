// src/components/AuthRedirect.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("http://localhost/UKTC-TESSIS/backend/src/routes/user.php", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                console.log(token);
                const text = await response.text();
                const data = JSON.parse(text);

                if (data?.user?.role === "admin") {
                    navigate("/admin");
                } else if (data?.user?.role === "student") {
                    navigate("/home");
                } else {
                    navigate("/login");
                }

            } catch (error) {
                console.error("Auth error:", error);
                navigate("/login");
            }
        };

        checkAuth();
    }, [navigate]);

    return <p className="text-center mt-10">Зареждане...</p>;
};

export default AuthRedirect;
