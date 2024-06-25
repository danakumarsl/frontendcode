const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;
const secretKey = 'your_secret_key';

mongoose.connect('mongodb+srv://danakumarsl21csd:eGTzlH5vILklEB01@cluster0.v8zquwe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/Todo', );

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

const TodoSchema = new mongoose.Schema({
    todo: String,
    username: String
});

const User = mongoose.model('User', UserSchema);
const Todo = mongoose.model('Todo', TodoSchema);

app.use(cors());
app.use(bodyParser.json());

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User created');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).send('Invalid credentials');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ username }, secretKey);
    res.json({ token });
});

app.post('/posting', authenticateToken, async (req, res) => {
    const { todo } = req.body;
    const newTodo = new Todo({
        todo,
        username: req.user.username
    });
    await newTodo.save();
    res.status(201).send('Todo created');
});

app.get('/getting', authenticateToken, async (req, res) => {
    const userTodos = await Todo.find({ username: req.user.username });
    res.json(userTodos);
});

app.put('/updating/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { todo } = req.body;
    const todoItem = await Todo.findOneAndUpdate({ _id: id, username: req.user.username }, { todo }, { new: true });
    if (!todoItem) {
        return res.status(404).send('Todo not found');
    }
    res.send('Todo updated');
});

app.delete('/deleting/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const todoItem = await Todo.findOneAndDelete({ _id: id, username: req.user.username });
    if (!todoItem) {
        return res.status(404).send('Todo not found');
    }
    res.send('Todo deleted');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
