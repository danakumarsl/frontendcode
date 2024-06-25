import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TodoList from './Components/TodoList.js';
import Login from './Components/Login';
import SignUp from './Components/SignUp';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TodoList />} />
                
            </Routes>
        </Router>
    );
};

export default App;
