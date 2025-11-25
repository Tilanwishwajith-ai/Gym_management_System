const router = require('express').Router();
router.post('/add', async (req, res) => {
    const { name, age, package: pkg } = req.body;
    const newMember = new Member({ name, age, package: pkg });
    try { await newMember.save(); res.json("Member Added"); } 
    catch (err) { res.status(500).send({ error: err.message }); }
});
module.exports = router;