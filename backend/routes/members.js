const router = require('express').Router();
let Member = require('../models/Member');

// ... (මුල ටික එහෙමමයි) ...

// 1. Add Route (වෙනසක් නෑ)
router.post('/add', async (req, res) => {
    const { name, age, package: pkg } = req.body;
    const newMember = new Member({ name, age, package: pkg });
    try { await newMember.save(); res.json("Member Added"); } 
    catch (err) { res.status(500).send({ error: err.message }); }
});

// 2. Get All (වෙනසක් නෑ)
router.get('/', async (req, res) => {
    try { const members = await Member.find(); res.json(members); } 
    catch (err) { res.status(500).send({ error: err.message }); }
});

// 3. Get Single (වෙනසක් නෑ)
router.get('/get/:id', async (req, res) => {
    try { const userId = req.params.id; const user = await Member.findById(userId); res.status(200).send({ status: "User fetched", user: user }); } 
    catch (err) { res.status(500).send({ error: err.message }); }
});

// 4. Update Route (මෙන්න අලුත් එක - weightHistory එක්ක)
router.put('/update/:id', async (req, res) => {
    const userId = req.params.id;
    // weightHistory එකත් destructured කළා
    const { name, age, package: pkg, workoutPlan, height, weight, bmi, attendance, paidUntil, weightHistory } = req.body;

    const updateMember = {
        name, age, package: pkg, workoutPlan, height, weight, bmi, attendance, paidUntil, 
        weightHistory // මේකත් update වෙනවා
    };

    try {
        await Member.findByIdAndUpdate(userId, updateMember);
        res.status(200).send({ status: "User updated" });
    } catch (err) {
        res.status(500).send({ status: "Error with updating data", error: err.message });
    }
});
module.exports = router;