const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- මම ඔයාගේ ලොග් වලින් හොයාගත්තු "ඇත්තම" ලින්ක් එක ---
// මෙය කෙලින්ම සර්වර් 3ට සම්බන්ධ වෙනවා.

const uri = "mongodb://tilanwishwajith_db_user:gym1234.@ac-ojbijog-shard-00-00.qwk5iyx.mongodb.net:27017,ac-ojbijog-shard-00-01.qwk5iyx.mongodb.net:27017,ac-ojbijog-shard-00-02.qwk5iyx.mongodb.net:27017/?ssl=true&replicaSet=atlas-128dqf-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log("DB Connection Error: ", err));

const memberRoute = require('./routes/members');
app.use('/api/members', memberRoute);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});