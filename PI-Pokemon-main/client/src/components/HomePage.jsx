import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import { Link } from 'react-router-dom';
import videoSource from '../Media/pokemon-emerald-waterfall-pixel-moewalls-com.mp4'

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterOrigin, setFilterOrigin] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [pokemons, setPokemons] = useState([]);
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pokemonsPerPage = 12;


    const indexOfLastPokemon = currentPage * pokemonsPerPage;
    const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
    const currentPokemons = filteredPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);
    const fetchPokemonsFromAPI = async () => {
        try {
            const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=897');
            const pokemonDetails = await Promise.all(
                response.data.results.map(async (pokemon, id) => {
                    const detailResponse = await axios.get(pokemon.url);
                    return { 
                        ...pokemon, 
                        id: id + 1, 
                        image: detailResponse.data.sprites.front_default,
                        types: detailResponse.data.types.map(type => type.type.name)
                    };
                })
            );
            setPokemons(pokemonDetails);
            setFilteredPokemons(pokemonDetails);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchPokemonsFromDB = async () => {
        try {
            const response = await axios.get('http://localhost:3001/pokemons');
            setPokemons(response.data);
            setFilteredPokemons(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchPokemonsFromAPI();
        fetchPokemonsFromDB();
    }, []);

    const handleSearch = () => {
        let result = pokemons;
    
        if (searchTerm) {
            result = result.filter(pokemon => pokemon.name.includes(searchTerm));
        }
    
        if (filterType) {
            result = result.filter(pokemon => pokemon.types.includes(filterType));
        }
    
        if (filterOrigin) {
            if (filterOrigin === 'api') {
                result = result.filter(pokemon => pokemon.url.includes('pokeapi.co'));
            } else if (filterOrigin === 'database') {
                result = result.filter(pokemon => !pokemon.url.includes('pokeapi.co'));
            }
        }
    
        if (sortOption) {
            const [field, order] = sortOption.split('-');
            result.sort((a, b) => {
                if (a[field] === null || b[field] === null) {
                    return 0;
                }
                if (order === 'asc') {
                    return a[field] > b[field] ? 1 : -1;
                } else {
                    return a[field] < b[field] ? 1 : -1;
                }
            });
        }
    
        setFilteredPokemons(result);
    };

    const handleTypeFilter = (e) => {
        setFilterType(e.target.value);
    };

    const handleOriginFilter = (e) => {
        setFilterOrigin(e.target.value);
    };

    const handleSortOption = (e) => {
        setSortOption(e.target.value);
    };

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredPokemons.length / pokemonsPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <div className="container">
            
        <div className="home-page">
            <video autoPlay muted loop className="background-video">
                <source src={videoSource} type="video/mp4" />
            </video>
            <div className='content'>
                <div className='barra'>
                    <div className='botones'>
                        <Link to="/">
                            <button className='back'>Back</button>
                        </Link>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name"
                    />
            <select onChange={handleTypeFilter}>
                <option value="">All types</option>
                <option value="normal">Normal</option>
                <option value="fire">Fire</option>
                <option value="water">Water</option>
                <option value="electric">Electric</option>
                <option value="grass">Grass</option>
                <option value="ice">Ice</option>
                <option value="fighting">Fighting</option>
                <option value="poison">Poison</option>
                <option value="ground">Ground</option>
                <option value="flying">Flying</option>
                <option value="psychic">Psychic</option>
                <option value="bug">Bug</option>
                <option value="rock">Rock</option>
                <option value="ghost">Ghost</option>
                <option value="dragon">Dragon</option>
                <option value="dark">Dark</option>
                <option value="steel">Steel</option>
                <option value="fairy">Fairy</option>
            </select>
            <select onChange={handleOriginFilter}>
                <option value="">All origins</option>
                <option value="api">API</option>
                <option value="database">Database</option>
            </select>
            <button onClick={handleSearch}>Search</button>
            <select onChange={handleSortOption}>
                <option value="">Sort by</option>
                <option value="name-desc">Name (A-Z)</option>
                <option value="name-asc">Name (Z-A)</option>
                <option value="attack-asc">Attack (Low-High)</option>
                <option value="attack-desc">Attack (High-Low)</option>
            </select>
            <button onClick={handleSearch}>Search</button>
            <div className='botones'>
                <Link to="/create">
                    <button className='agregar'>Agregar</button>
                </Link>
            </div>
            </div>
                <div className="pokemonCard">
                    {currentPokemons.map((pokemon) => (
                        <Link to={`/pokemon/${pokemon.id}`} key={pokemon.id}>
                            <div className="individualCard" onClick={(e) => e.stopPropagation()}>
                                <img src={pokemon.image} alt={pokemon.name} />
                                <p>Name: {pokemon.name}</p>
                                <p>Types: {pokemon.types ? pokemon.types.join(', ') : 'No types available'}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div>
                    {pageNumbers.map(number => (
                        <button className="pageButton" key={number} onClick={() => setCurrentPage(number)}>
                            {number}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
}
export default HomePage;