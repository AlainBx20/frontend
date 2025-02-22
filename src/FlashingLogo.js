import React, { useEffect, useState } from 'react';
import './FlashingLogo.css';

const FlashingLogo = ({ onTransitionComplete }) => {
    const [showLogo, setShowLogo] = useState(true);

    useEffect(() => {
        // Automatically hide the logo after 2 seconds
        const timer = setTimeout(() => {
            setShowLogo(false);
            onTransitionComplete();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onTransitionComplete]);

    return (
        <div className={`flashing-logo-overlay ${showLogo ? 'show' : ''}`}>
            <img src="Logo_STB.png" alt="STB Logo" className="flashing-logo" />
        </div>
    );
};

export default FlashingLogo;
