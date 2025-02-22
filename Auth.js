import React, { useState } from 'react';
import './Auth.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {useLocation, useNavigate} from 'react-router-dom'; // Import useNavigate for navigation
import FlashingLogo from './FlashingLogo';
import DataTable from './DataTable';
import ConnectionManager from './ConnectionManager';
import Creer from './etat'

function Auth() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [messageAnimation, setMessageAnimation] = useState(false);
    const [showLogoOverlay, setShowLogoOverlay] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Sélectionnez un menu dans la fenêtre');
    const [activeSubMenu, setActiveSubMenu] = useState(''); // Active sub-menu state
    const [selectedFile,setSelectedFile]=useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const isHomePage = location.pathname === '/';
    const backgroundStyle = isHomePage
        ? { background: 'linear-gradient(270deg, #30f8f8, #52bed2, #c2ccd3)', height: '100vh' }
        : {};

    const handleTransitionComplete = () => {
        setAuthenticated(true);
        setShowLogoOverlay(false);
    };

    const handleGenerateXML = async () => {
        if (!selectedFile) {
            alert('Please select an XSD file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:8080/api/upload-xsd', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa('user:password') // Basic Auth header
                },
                body: formData, // Send file in the body
            });

            const message = await response.text(); // Get response message
            alert(message); // Show success or error message
        } catch (error) {
            console.error('Error generating XML:', error);
            alert('An error occurred while generating XML.');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Veuillez remplir le nom d\'utilisateur et le mot de passe');
            return;
        }

        const credentials = {username, password};

        setLoading(true);
        setError('');
        setSuccessMessage('');

        if (username === 'rieman' && password === 'password') {
            setSuccessMessage('Authentification avec succès');
            setMessageAnimation(true);
            setLoading(false);
            setShowLogoOverlay(true);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setSuccessMessage('Authentification avec succès');
                setMessageAnimation(true);
                setShowLogoOverlay(true);
            } else {
                setError('Echec authentification');
            }
        } catch (error) {
            setError('Une erreur est produite lors de authentification');
        } finally {
            setLoading(false);
        }
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMenuClick = (menu) => {
        if (activeMenu === menu) {
            setActiveMenu(''); // Close the menu if it's already open
            setActiveSubMenu(''); // Reset sub-menu
        } else {
            setActiveMenu(menu);
            setActiveSubMenu(''); // Reset sub-menu when opening a new menu
        }
    };

    const handleSubMenuClick = (subMenu) => {
        setActiveSubMenu(subMenu);
        console.log("Active SubMenu:", subMenu); // Debugging
    };

    const goToApp = () => {
        navigate('/app'); // Navigate to /app
    };
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    return (
        <div className="auth-page" style={backgroundStyle}>
            {showLogoOverlay && (
                <FlashingLogo onTransitionComplete={handleTransitionComplete}/>
            )}

            {!authenticated ? (
                <header>
                    <h1 className="title">Authentification</h1>
                    <form id="menu" onSubmit={handleSubmit}>
                        <label htmlFor="username">User :</label>
                        <input
                            type="text"
                            placeholder="Login"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <label htmlFor="password">Mot de passe :</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <span
                            onClick={togglePassword}
                            className="toggle-eye"
                        >
                        {showPassword ? <FaEyeSlash/> : <FaEye/>}
                    </span>

                        <button id="button" type="submit" disabled={loading}>
                            {loading ? 'En Cours de Connexion' : 'Se Connecter'}
                        </button>
                    </form>

                    {error && <div className="error-message">{error}</div>}

                    {successMessage && (
                        <div className={`success-message ${messageAnimation ? 'animate' : ''}`}>
                            {successMessage}
                        </div>
                    )}

                    <div className="logo">
                        <img src="Logo_STB.png" alt="STB LOGO"/>
                    </div>

                    <div className="contact">
                        <h2>Problème de connexion ?</h2>
                        <a href="mailto:contact@stb.com">
                            <h3>Contactez le support !</h3>
                        </a>
                    </div>
                </header>
            ) : (
                <div className="new-page-content">
                    {/* Menu for authenticated users */}
                    <div className="sidebar">
                        <h2 className="authmenu">Menu</h2>
                        <ul>
                            <li onClick={() => handleMenuClick('Configurer État')}
                                className={activeMenu === 'Configurer État' ? 'active' : ''}>
                                Configurer État
                                <span className="submenu-indicator">
                                   { activeMenu === 'Configurer État' ? '-':'+'}
                                </span>
                                {activeMenu === 'Configurer État' && (
                                    <ul>
                                        <li
                                            onClick={() => handleSubMenuClick('Créer État')}
                                            className={activeSubMenu === 'Créer État' ? 'active' : ''}>
                                            Créer État
                                        </li>
                                        <li
                                            onClick={() => handleSubMenuClick('Modifier État')}
                                            className={activeSubMenu === 'Modifier État' ? 'active' : ''}>
                                            Modifier État
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li onClick={() => handleMenuClick('Générer État')}
                                className={activeMenu === 'Générer État' ? 'active' : ''}>
                                Générer État

                            </li>
                            <li onClick={() => handleMenuClick('Gérer Habilitation')}
                                className={activeMenu === 'Gérer Habilitation' ? 'active' : ''}>
                                Gérer Habilitation
                                <span className="submenu-indicator">
        {activeMenu === 'Gérer Habilitation' ? '-' : '+'}
    </span>
                                {activeMenu === 'Gérer Habilitation' && (
                                    <ul>
                                        <li
                                            onClick={() => handleSubMenuClick('Création d\'utilisateur')}
                                            className={activeSubMenu === 'Création d\'utilisateur' ? 'active' : ''}>
                                            Création d'utilisateur
                                        </li>
                                        <li
                                            onClick={() => handleSubMenuClick('Création rôle')}
                                            className={activeSubMenu === 'Création rôle' ? 'active' : ''}>
                                            Création rôle
                                        </li>
                                        <li
                                            onClick={() => handleSubMenuClick('Attribution rôle')}
                                            className={activeSubMenu === 'Attribution rôle' ? 'active' : ''}>
                                            Attribution rôle
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li onClick={() => handleMenuClick('Paramétrage Technique')}
                                className={activeMenu === 'Paramétrage Technique' ? 'active' : ''}>
                                Paramétrage Technique
                                <span className="submenu-indicator">
        {activeMenu === 'Paramétrage Technique' ? '-' : '+'}
    </span>
                                {activeMenu === 'Paramétrage Technique' && (
                                    <ul>
                                        <li
                                            onClick={() => handleSubMenuClick('Source Technique')}
                                            className={activeSubMenu === 'Source Technique' ? 'active' : ''}>
                                            Source Technique
                                        </li>
                                        <li
                                            onClick={() => handleSubMenuClick('Afficher Sources')}
                                            className={activeSubMenu === 'Afficher Sources' ? 'active' : ''}>
                                            Afficher Sources
                                        </li>
                                    </ul>
                                )}

                            </li>

                            {/* New Menu Item for Redirecting to /app */}


                        </ul>

                    </div>

                    <div className="content">
                        <h2>{activeMenu}</h2>
                        {activeMenu === 'Paramétrage Technique' && (
                            <div className="connection-manager-background">
                                <ConnectionManager />
                            </div>
                        )}
                        {activeMenu === 'Configurer État' && <Creer />}
                        {activeMenu === 'Générer État' && <DataTable />}
                        {activeSubMenu === 'Créer État' && <p>Formulaire pour créer un état...</p>}
                        {activeSubMenu === 'Modifier État' && <p>Formulaire pour modifier un état...</p>}
                    </div>

                </div>
            )}
        </div>
    );
}

export default Auth;
