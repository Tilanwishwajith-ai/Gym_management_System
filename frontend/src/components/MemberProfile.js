import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
// Chart එක සඳහා Recharts import කිරීම
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MemberProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [pkg, setPkg] = useState("");
    const [plan, setPlan] = useState("");
    
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bmiResult, setBmiResult] = useState("Not Calculated");
    const [bmiColor, setBmiColor] = useState("white");

    const [attendance, setAttendance] = useState([]);
    
    // Payment
    const [paidUntil, setPaidUntil] = useState(new Date());
    const [paymentStatus, setPaymentStatus] = useState("Checking...");
    const [statusColor, setStatusColor] = useState("white");

    // Weight History (Chart Data)
    const [weightHistory, setWeightHistory] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/members/get/${id}`)
            .then((res) => {
                const user = res.data.user;
                setName(user.name);
                setAge(user.age);
                setPkg(user.package);
                setPlan(user.workoutPlan);
                setHeight(user.height);
                setWeight(user.weight);
                setBmiResult(user.bmi);
                calculateColor(user.bmi); 
                setAttendance(user.attendance || []);
                setWeightHistory(user.weightHistory || []); // History එක ගන්නවා

                if(user.paidUntil) {
                    checkPaymentStatus(new Date(user.paidUntil));
                    setPaidUntil(new Date(user.paidUntil));
                }
            })
            .catch((err) => { console.log(err); });
    }, [id]);

    // --- Helper Functions ---
    const checkPaymentStatus = (expiryDate) => {
        const today = new Date();
        if (today > expiryDate) {
            setPaymentStatus("EXPIRED"); setStatusColor("#e74c3c");
        } else {
            const diffDays = Math.ceil(Math.abs(expiryDate - today) / (1000 * 60 * 60 * 24)); 
            setPaymentStatus(`ACTIVE (${diffDays} Days Left)`); setStatusColor("#2ecc71");
        }
    };

    const renewMembership = () => {
        const newDate = new Date(paidUntil);
        newDate.setDate(newDate.getDate() + 30);
        setPaidUntil(newDate); checkPaymentStatus(newDate);
        alert("Membership extended! (Click Save)");
    };

    const markAttendance = () => {
        const now = new Date();
        const todayString = now.toDateString(); 
        if (attendance.some(date => new Date(date).toDateString() === todayString)) {
            alert("⚠️ Attendance already marked today!"); return; 
        }
        setAttendance([...attendance, now]); 
        alert("✅ Attendance Marked!");
    };

    const calculateBMI = (e) => {
        if(e) e.preventDefault();
        if (!height || !weight) { alert("Enter Height & Weight!"); return; }
        const hM = height / 100;
        const val = (weight / (hM * hM)).toFixed(2);
        
        let status = "", col = "";
        if (val < 18.5) { status=`Underweight (${val})`; col="#f1c40f"; }
        else if (val < 24.9) { status=`Normal (${val})`; col="#2ecc71"; }
        else if (val < 29.9) { status=`Overweight (${val})`; col="#e67e22"; }
        else { status=`Obese (${val})`; col="#e74c3c"; }

        setBmiResult(status); setBmiColor(col);
    };

    const calculateColor = (s) => {
        if(!s) return;
        if(s.includes("Normal")) setBmiColor("#2ecc71");
        else if(s.includes("Obese")) setBmiColor("#e74c3c");
        else if(s.includes("Overweight")) setBmiColor("#e67e22");
        else if(s.includes("Underweight")) setBmiColor("#f1c40f");
    }

    // --- SAVE FUNCTION (Update) ---
    const updateProfile = (e) => {
        e.preventDefault();

        // Save කරන වෙලාවේ දැනට තියෙන බර History එකට එකතු කරනවා
        // අන්තිම Record එක අද දවස නෙවෙයි නම් විතරක් අලුතින් එකතු කරන්න
        const today = new Date().toDateString();
        let updatedHistory = [...weightHistory];

        // බර වෙනස් වී ඇත්නම් හෝ අද දවසට record එකක් නැත්නම් add කරන්න
        const lastRecord = weightHistory[weightHistory.length - 1];
        if (!lastRecord || new Date(lastRecord.date).toDateString() !== today) {
            updatedHistory.push({ weight: weight, date: new Date() });
        } else {
            // අද දවසට දැනටමත් record එකක් තියෙනවා නම්, අන්තිම එක update කරන්න
            updatedHistory[updatedHistory.length - 1].weight = weight;
        }

        const updateObject = { 
            name, age, package: pkg, workoutPlan: plan, 
            height, weight, bmi: bmiResult, attendance, paidUntil,
            weightHistory: updatedHistory // Chart Data යවනවා
        };

        axios.put(`http://localhost:5000/api/members/update/${id}`, updateObject) 
            .then(() => {
                alert("All Data & Progress Saved!");
                navigate('/'); 
            })
            .catch((err) => { alert(err); });
    };

    // Chart එකට Data හදාගැනීම (දිනය කෙටි කර පෙන්වීමට)
    const chartData = weightHistory.map(record => ({
        date: new Date(record.date).toLocaleDateString(), // 11/25 වගේ පෙන්නන්න
        weight: record.weight
    }));

    return (
        <div className="form-container" style={{maxWidth: "1000px", marginTop: "30px", border: "1px solid #333"}}>
            <Link to="/" style={{color: "#00d2ff", textDecoration: "none", fontSize: "14px"}}>← Back to Dashboard</Link>
            
            <div style={{textAlign: "center", marginBottom: "20px"}}>
                 <h2 style={{color: "white", margin: "10px 0"}}>Member Profile</h2>
                 <h1 style={{color: "#00d2ff", margin: 0, textTransform: "uppercase"}}>{name}</h1>
                 <div style={{display: "inline-block", padding: "5px 15px", borderRadius: "20px", backgroundColor: statusColor, color: "black", fontWeight: "bold", marginTop: "10px"}}>
                     {paymentStatus}
                 </div>
            </div>

            <div style={{display: "flex", gap: "20px", flexWrap: "wrap"}}>
                
                {/* --- Left: Workout & Chart --- */}
                <div style={{flex: 1.5, minWidth: "400px"}}>
                    
                    {/* Progress Chart (New) */}
                    <div style={{backgroundColor: "#252538", padding: "20px", borderRadius: "12px", border: "1px solid #444", marginBottom: "20px"}}>
                        <h4 style={{color: "#b0b0b0", marginTop: 0}}>📉 Weight Progress Chart</h4>
                        <div style={{width: "100%", height: 250}}>
                            <ResponsiveContainer>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis dataKey="date" stroke="#888" />
                                    <YAxis stroke="#888" domain={['auto', 'auto']} /> {/* බර අනුව Auto Adjust වෙනවා */}
                                    <Tooltip contentStyle={{backgroundColor: "#333", border: "none"}} />
                                    <Line type="monotone" dataKey="weight" stroke="#00d2ff" strokeWidth={3} dot={{r: 5}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        {weightHistory.length < 2 && <p style={{color: "#666", fontSize: "12px", textAlign: "center"}}>* Save data on different days to see the line.</p>}
                    </div>

                    <h4 style={{color: "#b0b0b0", marginBottom: "5px"}}>🏋️ Workout Schedule</h4>
                    <textarea rows="10" className="form-control" value={plan} onChange={(e) => setPlan(e.target.value)} placeholder="Type schedule..." style={{fontFamily: "monospace"}}></textarea>
                </div>

                {/* --- Right: BMI, Payment, Attendance --- */}
                <div style={{flex: 1, minWidth: "300px"}}>
                    
                    {/* Payment */}
                    <div style={{backgroundColor: "#252538", padding: "15px", borderRadius: "12px", border: "1px solid #444", marginBottom: "15px"}}>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <h4 style={{color: "#b0b0b0", margin: 0}}>💰 {pkg} Package</h4>
                            <button onClick={renewMembership} style={{padding: "8px", background: "linear-gradient(90deg, #f09819 0%, #edde5d 100%)", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", color: "#333"}}>Renew</button>
                        </div>
                    </div>

                    {/* BMI */}
                    <div style={{backgroundColor: "#252538", padding: "15px", borderRadius: "12px", border: "1px solid #444", marginBottom: "15px"}}>
                        <h4 style={{color: "#b0b0b0", margin: "0 0 10px 0"}}>⚖️ BMI Calculator</h4>
                        <div style={{display: "flex", gap: "10px", marginBottom: "10px"}}>
                            <input type="number" className="form-control" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} />
                            <input type="number" className="form-control" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
                        </div>
                        <button type="button" onClick={calculateBMI} className="btn-submit" style={{background: "#333", marginBottom: "10px", border: "1px solid #555"}}>Calculate</button>
                        <div style={{backgroundColor: "#151521", padding: "10px", borderRadius: "10px", textAlign: "center", border: `2px solid ${bmiColor}`}}>
                            <h2 style={{margin: "0", color: bmiColor, fontSize: "20px"}}>{bmiResult}</h2>
                        </div>
                    </div>

                    {/* Attendance */}
                    <div style={{backgroundColor: "#252538", padding: "15px", borderRadius: "12px", border: "1px solid #444"}}>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px"}}>
                            <h4 style={{color: "#b0b0b0", margin: 0}}>📅 Attendance ({attendance.length})</h4>
                            <button onClick={markAttendance} style={{padding: "5px 10px", backgroundColor: "#2ecc71", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold"}}>+ Mark</button>
                        </div>
                        <div style={{backgroundColor: "#151521", padding: "5px", borderRadius: "8px", maxHeight: "80px", overflowY: "auto"}}>
                            {attendance.slice().reverse().slice(0, 3).map((date, i) => (
                                <div key={i} style={{color: "#aaa", fontSize: "12px", padding: "3px 0", borderBottom: "1px solid #333"}}>✅ {new Date(date).toDateString()}</div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            <button onClick={updateProfile} className="btn-submit" style={{marginTop: "20px", background: "linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)"}}>
                💾 Save All Changes
            </button>
        </div>
    )
}