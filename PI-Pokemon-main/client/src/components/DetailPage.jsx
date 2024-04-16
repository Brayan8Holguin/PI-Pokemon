import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './DetailPage.css';

const DetailPage = () => {
    const { id } = useParams();
    const [pokemonDetails, setPokemonDetails] = useState(null);

    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => response.json())
            .then(data => setPokemonDetails(data));
    }, [id]);

    return (
        <div className="main-container">
            <header className='header'>
                <Link className="button" to="/home">⬅️BACK</Link>
            </header>
            <div className="detail-container">
                {pokemonDetails && (
                    <div className="card">
                        <p className="card-text"> ID: {pokemonDetails.id}</p>
                        <p className="card-text">Name: {pokemonDetails.name}</p>
                        <img className='pokemon-image' src={pokemonDetails.sprites.front_default} alt={pokemonDetails.name} />
                        <p className="card-text">Life: {pokemonDetails.stats.find(stat => stat.stat.name === 'hp').base_stat}</p>
                        <p className="card-text">Attack: {pokemonDetails.stats.find(stat => stat.stat.name === 'attack').base_stat}</p>
                        <p className="card-text">Defense: {pokemonDetails.stats.find(stat => stat.stat.name === 'defense').base_stat}</p>
                        <p className="card-text">Speed: {pokemonDetails.stats.find(stat => stat.stat.name === 'speed').base_stat}</p>
                        <p className="card-text">Height: {pokemonDetails.height}</p>
                        <p className="card-text">Weight: {pokemonDetails.weight}</p>
                        <p className="card-text">Type: {pokemonDetails.types.map(type => type.type.name).join(', ')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
export default DetailPage;