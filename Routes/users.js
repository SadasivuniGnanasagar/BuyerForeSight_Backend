const express = require('express');
const fs = require('fs');
const router = express.Router();

const filePath = './Data/users.json';

// Helper function to read data
const getUsers = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Helper function to write data
const saveUsers = (users) => {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

// ✅ GET /users (with search & sort)
router.get('/', (req, res) => {
    let users = getUsers();

    const { search, sort, order } = req.query;

    // 🔍 Search
    if (search) {
        users = users.filter(user =>
            user.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    // 🔃 Sort
    if (sort) {
        users.sort((a, b) => {
            if (order === 'desc') {
                return b[sort].localeCompare(a[sort]);
            }
            return a[sort].localeCompare(b[sort]);
        });
    }

    res.json(users);
});

// ✅ GET /users/:id
router.get('/:id', (req, res) => {
    const users = getUsers();
    const user = users.find(u => u.id == req.params.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
});

// ✅ POST /users

router.post('/', (req, res) => {
    const users = getUsers();

    if (!req.body.name || !req.body.email) {
        return res.status(400).json({ message: "Name and Email required" });
    }

    // 🔥 Auto increment ID
    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

    const newUser = {
        id: newId,
        name: req.body.name,
        email: req.body.email
    };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json(newUser);
});

// ✅ PUT /users/:id
router.put('/:id', (req, res) => {
    const users = getUsers();
    const index = users.findIndex(u => u.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    users[index] = {
        ...users[index],
        name: req.body.name,
        email: req.body.email
    };

    saveUsers(users);
    res.json(users[index]);
});

// ✅ DELETE /users/:id
router.delete('/:id', (req, res) => {
    let users = getUsers();
    const newUsers = users.filter(u => u.id != req.params.id);

    if (users.length === newUsers.length) {
        return res.status(404).json({ message: "User not found" });
    }

    saveUsers(newUsers);
    res.json({ message: "User deleted successfully" });
});

module.exports = router;