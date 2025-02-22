import React, { useState } from 'react';
import sqlLogo from './sql-server-logo.png';
import oracleLogo from './oracle-logo.png';
import excelLogo from './excel-logo.png';
import lanLogo from './lan-logo.png'; // Assuming you have an image for LAN
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Handle SQL Server click
  const handleSQLServerClick = () => {
    setShowModal(true); // Show modal for SQL Server credentials
  };

  // Handle credentials submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      });

      const data = await response.text();
      setMessage(data); // Display the response from the backend

      if (data.includes('Connected successfully')) {
        setConnected(true); // If connected, set the flag to true
        setShowModal(false); // Close the modal
        navigate('/ChooseTable'); // Redirect to table selection page
      }
    } catch (error) {
      console.error("Erreur de connexion au backend", error);
      setMessage("La Connexion a échoué. Veuillez réessayer");
    }
  };
  const isHomePage = location.pathname === '/';
  const backgroundStyle = isHomePage
      ? { background: 'linear-gradient(270deg, #30f8f8, #52bed2, #c2ccd3)', height: '100vh' }
      : {};

  return (
      <div className="App" style={backgroundStyle}>
        <header className="App-header">
          <h1>Sélectionnez la base de données pour l'authentification.</h1>
          <form id="menu" onSubmit={(e) => e.preventDefault()}>
            <button id="b1" onClick={handleSQLServerClick}>
              <img src={sqlLogo} alt="SQL Server" className="icon" />
              SQL Server
            </button>
            <button id="b2">
              <img src={oracleLogo} alt="Oracle" className="icon" />
              Oracle
            </button>
            <button id="b3">
              <img src={excelLogo} alt="Excel" className="icon" />
              Excel
            </button>
            <button id="b4">
              <img src={lanLogo} alt="LAN" className="icon" />
              LAN
            </button>

            {message && <p className="message">{message}</p>}
          </form>
        </header>

        {/* Modal for SQL Server credentials */}
        {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Entrez les identifications du serveur SQL</h2>
                <form onSubmit={handleSubmit}>
                  <div className="input-container">
                    <label htmlFor="username">Nom d'utilisateur:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="password">Mot de passe:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                  </div>
                  <button type="submit">Connecter</button>
                  <button type="button" onClick={() => setShowModal(false)}>
                    Annuler
                  </button>
                </form>

                {message && <p className="message">{message}</p>}
              </div>
            </div>
        )}
      </div>
  );
}

export default App;
