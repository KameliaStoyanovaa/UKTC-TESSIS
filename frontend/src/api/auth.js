const API_URL = "http://localhost/UKTC-TESSIS/backend/src/routes/auth.php";

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
};

export const register = async (name, email, password, role) => {
    console.log(name, email, password, role)
    const response = await fetch(`${API_URL}?action=register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
    });
    return response.json();
};

export const getUserInfo = async (token) => {
    const response = await fetch("http://localhost/UKTC-TESSIS/backend/src/routes/user.php", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
};
