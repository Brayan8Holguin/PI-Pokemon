import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './DetailPage.css';

const DetailPage = () => {
    const { id } = useParams();
    const [pokemonDetails, setPokemonDetails] = useState(null);

    useEffect(() => {
        // Solicita los detalles del Pokémon a tu propia API
        axios.get(`http://localhost:3001/pokemons/${id}`)
            .then(response => setPokemonDetails(response.data))
            .catch(error => console.error(error));
    }, [id]);

    return (
        <div className="main-container">
            <header className='header'>
                <Link className="button" to="/home">⬅️BACK</Link>
            </header>
            <div className="detail-container">
            {pokemonDetails && pokemonDetails.sprites && (
    <div className="card">
        <p className="card-text top-margin"> ID: {pokemonDetails.id}</p>
        <p className="card-text">Name: {pokemonDetails.name}</p>
        <img className='pokemon-image' src={pokemonDetails.sprites.front_default} alt={pokemonDetails.name} />
        <p className="card-text">Life: {pokemonDetails.stats.find(stat => stat.stat.name === 'hp').base_stat}</p>
        <p className="card-text">Attack: {pokemonDetails.stats.find(stat => stat.stat.name === 'attack').base_stat}</p>
        <p className="card-text">Defense: {pokemonDetails.stats.find(stat => stat.stat.name === 'defense').base_stat}</p>
        <p className="card-text">Speed: {pokemonDetails.stats.find(stat => stat.stat.name === 'speed').base_stat}</p>
    </div>
)}
            </div>
        </div>
    );
};

export default DetailPage;