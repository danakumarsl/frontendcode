import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

import Login from './Login';

import SignUp from './SignUp';
const TodoList = () => {
    const [todo, setTodo] = useState('');
    const [todos, setTodos] = useState([]);
    const [token, setToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true);
            getData();
        } else {
            setIsLoggedIn(false);
        }
    }, [token]);

    const create = () => {
        axios.post('http://localhost:5000/posting', { todo }, {
            headers: { 'Authorization': token }
        })
            .then(() => {
                alert('Data has been posted successfully');
                setTodo('');
                getData();
            })
            .catch(() => {
                alert('Failed to post data');
            });
    };

    const getData = () => {
        axios.get('http://localhost:5000/getting', {
            headers: { 'Authorization': token }
        })
            .then((response) => {
                setTodos(response.data);
            })
            .catch(() => {
                alert('Failed to retrieve data');
            });
    };

    const updatedTodo = (id, updatedData) => {
        axios.put(`http://localhost:5000/updating/${id}`, { todo: updatedData }, {
            headers: { 'Authorization': token }
        })
            .then(() => {
                console.log('Todo updated successfully');
                getData();
            })
            .catch((error) => {
                console.error('Failed to update todo:', error);
                alert('Failed to update todo');
            });
    };

    const handleEditButtonClick = (id) => {
        const newdata = prompt("Enter the new data");

        if (newdata === null || newdata.trim() === '') {
            alert("Please enter valid new data");
            return;
        }

        updatedTodo(id, newdata.trim());
    };

    const deleteTodo = (id) => {
        axios.delete(`http://localhost:5000/deleting/${id}`, {
            headers: { 'Authorization': token }
        })
            .then(() => {
                getData();
            })
            .catch(() => {
                alert("Data cannot be deleted");
            });
    };

    return (
        <Container>
            {!isLoggedIn ? (
                <>
                    <Login setToken={setToken} />
                    <SignUp />
                </>
            ) : (
                <>
                    <Box sx={{ display: 'flex', marginBottom: '10px', marginTop: "50px" }}>
                        <TextField
                            id="todo"
                            label="Todo"
                            variant="outlined"
                            value={todo}
                            onChange={(e) => setTodo(e.target.value)}
                        />
                        <Button variant="outlined" onClick={create} sx={{ marginLeft: '10px' }}>Post</Button>
                    </Box>

                    <List>
                        {todos.map((item) => (
                            <ListItem key={item._id} secondaryAction={
                                <>
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditButtonClick(item._id)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(item._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }>
                                <ListItemText primary={item.todo} />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </Container>
    );
};

export default TodoList;
