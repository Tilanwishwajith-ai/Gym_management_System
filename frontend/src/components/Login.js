import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // මෙතන තමයි ඔයාගේ Username සහ Password තියෙන්නේ
        // කැමති නම් මේවා වෙනස් කරගන්න
        if (username === "admin" && password === "123") {
            // Login වුනාම Browser එකේ මතක තියාගන්නවා
            localStorage.setItem("isAdmin", "true");
            navigate("/"); // Dashboard එකට යවනවා
        } else {
            setError("Incorrect Username or Password!");
        }
    };

    return (
        <div style={{
            height: "100vh", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            backgroundColor: "#121212"
        }}>
            <div style={{
                backgroundColor: "#1e1e2f", 
                padding: "40px", 
                borderRadius: "15px", 
                boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                width: "350px",
                border: "1px solid #333",
                textAlign: "center"
            }}>
                <h1 style={{color: "#00d2ff", marginBottom: "20px"}}>🔒 ADMIN LOGIN</h1>
                
                {error && <p style={{color: "#e74c3c", backgroundColor: "rgba(231, 76, 60, 0.1)", padding: "10px", borderRadius: "5px"}}>{error}</p>}

                <form onSubmit={handleLogin}>
                    <div style={{marginBottom: "20px", textAlign: "left"}}>
                        <label style={{color: "#b0b0b0", display: "block", marginBottom: "5px"}}>Username</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div style={{marginBottom: "20px", textAlign: "left"}}>
                        <label style={{color: "#b0b0b0", display: "block", marginBottom: "5px"}}>Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-submit" style={{marginTop: "10px"}}>
                        Login to System
                    </button>
                </form>
            </div>
        </div>
    )
}