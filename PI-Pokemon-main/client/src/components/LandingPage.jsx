import React from 'react';
import videoSource from '../Media/hilda-and-tepig-watching-castelia-city-pokemon-pixel-moewalls-com.mp4';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <video autoPlay muted loop>
                <source src={videoSource} type="video/mp4" />
            </video>
            <button onClick={() => { window.location.href = '/home'; }}>
                Press Start
            </button>
            <div className="footer">Página creada por Brayan Holgín</div>
        </div>
    );
};

export default LandingPage;