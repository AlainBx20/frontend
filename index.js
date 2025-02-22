import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
import App from './App';
import Auth from './Auth';
import ChooseTable from './ChooseTable';  // Import the ChooseTable component
import ConnectionManager from './ConnectionManager';
import Etat from './etat'
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                {/* Redirect root (/) to /auth */}
                <Route path="/" element={<Navigate to="/auth" />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/app" element={<App />} />
                {/* Add the route for ChooseTable */}
                <Route path="/ChooseTable" element={<ChooseTable />} />
                <Route path="/connection-manager" element={<ConnectionManager />} />
                <Route path="/creeretat" element={<Etat />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
