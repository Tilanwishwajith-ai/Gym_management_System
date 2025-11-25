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

module.exports = router;