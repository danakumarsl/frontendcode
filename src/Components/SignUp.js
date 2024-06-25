import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box } from '@mui/material';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        axios.post('http://localhost:5000/signup', { username, password })
            .then(() => {
                alert('Signup successful');
            })
            .catch(() => {
                alert('Signup failed');
            });
    };

    return (
        <Box>
            <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={handleSignUp}>Sign Up</Button>
        </Box>
    );
};

export default SignUp;
