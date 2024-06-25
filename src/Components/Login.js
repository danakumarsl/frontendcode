import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box } from '@mui/material';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        axios.post('http://localhost:5000/login', { username, password })
            .then(response => {
                setToken(response.data.token);
                alert('Login successful');
            })
            .catch(() => {
                alert('Login failed');
            });
    };

    return (
        <Box>
            <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={handleLogin}>Login</Button>
        </Box>
    );
};

export default Login;
