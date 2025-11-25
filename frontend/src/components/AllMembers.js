import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate එකතු කළා

export default function AllMembers() {
    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); 
    const navigate = useNavigate(); // පිටු මාරු කිරීමට (Logout සඳහා)

    // 1. Data ලබා ගැනීම
    useEffect(() => {
        function getMembers() {
            axios.get("http://localhost:5000/api/members/")
                .then((res) => {
                    if (Array.isArray(res.data)) {
                        setMembers(res.data);
                    } else {
                        setMembers([]); 
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        getMembers();
    }, []);

    // 2. Delete Function
    const deleteMember = (id) => {
        const confirmBox = window.confirm("Do you really want to delete this member?");
        if (confirmBox === true) {
            axios.delete(`http://localhost:5000/api/members/delete/${id}`)
                .then(() => {
                    // Refresh නොකර ලිස්ට් එකෙන් අයින් කරනවා
                    setMembers(members.filter(member => member._id !== id));
                })
                .catch((err) => {
                    alert(err.message);
                });
        }
    }

    // 3. Logout Function (අලුත් කොටස)
    const handleLogout = () => {
        localStorage.removeItem("isAdmin"); // Key එක මකනවා
        navigate("/login"); // Login එකට යවනවා
    };

    // 4. Dashboard ගණන් කිරීම් (Stats)
    const totalMembers = members.length;
    const goldMembers = members.filter(m => m.package && m.package.toLowerCase().includes('gold')).length;
    const silverMembers = members.filter(m => m.package && m.package.toLowerCase().includes('silver')).length;

    return (
        <div className="table-container">
            
            {/* --- Header Area (Title & Buttons) --- */}
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
                <h3 style={{color: "#fff", margin: 0}}>Member List</h3>
                
                <div style={{display: "flex", gap: "10px"}}>
                    {/* Add Button */}
                    <Link to="/add">
                        <button className="btn-submit" style={{width: "auto", marginTop: 0, backgroundColor: "#00d2ff"}}>
                            + Add New
                        </button>
                    </Link>

                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout} 
                        className="btn-submit" 
                        style={{width: "auto", marginTop: 0, backgroundColor: "#e74c3c"}}>
                        Logout
                    </button>
                </div>
            </div>

            {/* --- Dashboard Stats (පෙට්ටි 3) --- */}
            <div className="dashboard-row">
                <div className="stat-card card-total">
                    <h3>Total Members</h3>
                    <h1>{totalMembers}</h1>
                </div>
                <div className="stat-card card-gold">
                    <h3>Gold Members</h3>
                    <h1>{goldMembers}</h1>
                </div>
                <div className="stat-card card-silver">
                    <h3>Silver Members</h3>
                    <h1>{silverMembers}</h1>
                </div>
            </div>

            {/* --- Search Bar --- */}
            <input 
                type="text" 
                placeholder="🔍 Search member by name..." 
                className="form-control"
                style={{marginBottom: "20px", border: "1px solid #00d2ff", backgroundColor: "#2a2a40", color: "white"}}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* --- Table List --- */}
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Package</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {members.length > 0 ? (
                        members.filter((member) => {
                            // Search Filter Logic
                            if(searchQuery === "") {
                                return member;
                            } else if (member.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                                return member;
                            }
                            return null;
                        }).map((member) => (
                            <tr key={member._id}>
                                <td>{member.name}</td>
                                <td>{member.age}</td>
                                <td>{member.package}</td>
                                <td>
                                    {/* View Button */}
                                    <Link to={`/profile/${member._id}`}>
                                        <button style={{ backgroundColor: "#00d2ff", color: "#000", padding: "5px 10px", border: "none", cursor: "pointer", marginRight: "10px", borderRadius: "4px", fontWeight: "bold" }}>
                                            View
                                        </button>
                                    </Link>
                                    
                                    {/* Delete Button */}
                                    <button onClick={() => deleteMember(member._id)} className="btn-delete">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>No members found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}