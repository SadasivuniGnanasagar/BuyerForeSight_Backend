const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./Routes/users');

const app = express();

app.use(bodyParser.json());
app.use('/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});