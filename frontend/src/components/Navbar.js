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
        <nav style={{ display: "flex", gap: "10px", padding: "10px" }}>
            
            
            {!token ? (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            ) : (
                
                <>
                <Link to="/">Home</Link>
                <Link to="/account">Account</Link>
                <button onClick={handleLogout}>Logout</button>
                </>
            )}
        </nav>
    );
};

export default Navbar;
