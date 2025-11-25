import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // useNavigate import කරන්න

export default function AddMember() {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [pkg, setPkg] = useState("");
    
    const navigate = useNavigate(); // මේකෙන් තමයි පිටු මාරු කරන්නේ

    function sendData(e) {
        e.preventDefault();
        const newMember = { name, age, package: pkg }

        axios.post("http://localhost:5000/api/members/add", newMember)
            .then(() => {
                alert("Member Added Successfully!");
                // Data Save වුනාට පස්සේ Home Page එකට යවනවා
                navigate('/'); 
            })
            .catch((err) => {
                alert(err);
            });
    }

    return (
        <div className="form-container" style={{marginTop: "50px"}}>
             {/* ආපසු යාමට බට්න් එකක් */}
            <Link to="/" style={{color: "#00d2ff", textDecoration: "none", marginBottom: "20px", display: "inline-block"}}>← Back to List</Link>
            
            <h3>Add New Member</h3>
            <form onSubmit={sendData}>
                <div className="form-group">
                    <label>Member Name</label>
                    <input type="text" className="form-control" placeholder="Enter full name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                
                <div className="form-group">
                    <label>Age</label>
                    <input type="number" className="form-control" placeholder="Enter age" value={age} onChange={(e) => setAge(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Package</label>
                    <input type="text" className="form-control" placeholder="Ex: Gold / Silver" value={pkg} onChange={(e) => setPkg(e.target.value)} required />
                </div>

                <button type="submit" className="btn-submit">Save Member</button>
            </form>
        </div>
    )
}