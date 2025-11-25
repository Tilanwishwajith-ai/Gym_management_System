const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    package: { type: String, required: true },
    workoutPlan: { type: String, default: "No plan assigned yet." },
    height: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    bmi: { type: String, default: "Not Calculated" },
    attendance: { type: [Date], default: [] },
    paidUntil: { type: Date, default: () => new Date(+new Date() + 30*24*60*60*1000) },

    // --- අලුත් කොටස (Weight History) ---
    // බර මනින දිනය සහ බර ප්‍රමාණය ලිස්ට් එකක් විදියට තියාගන්නවා
    weightHistory: { 
        type: [{ weight: Number, date: { type: Date, default: Date.now } }], 
        default: [] 
    },
    // ------------------------------------

    joinedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', memberSchema);