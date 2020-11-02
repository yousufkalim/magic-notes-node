//init
const express = require('express');
const router = express.Router();
const users = require('../Controllers/users');

router.get('/', users);
router.get('/login', users);
router.post('/', users);
router.get('/register', users);
router.post('/register', users);
router.get('/logout', users);
router.get("/notes", users);
router.post("/notes", users);
router.put("/mark/:id", users);
router.delete("/delete/:id", users);
router.get("/update/:id", users);
router.put("/update/:id", users);
router.all('*', users);

module.exports = router;