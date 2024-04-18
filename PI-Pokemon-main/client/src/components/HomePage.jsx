import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import { Link } from 'react-router-dom';
import videoSource from '../Media/pokemon-emerald-waterfall-pixel-moewalls-com.mp4'


const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState(''); //termino de busqueda 
    const [filterType, setFilterType] = useState(''); //tipo de filtro
    const [filterOrigin, setFilterOrigin] = useState(''); //origen de filtro
    const [sortOption, setSortOption] = useState(''); //opcion de ordenar
    const [pokemons, setPokemons] = useState([]); //pokemones
    const [filteredPokemons, setFilteredPokemons] = useState([]); //pokemones filtrados
    const [currentPage, setCurrentPage] = useState(1); //pagina actual
    const pokemonsPerPage = 12; //pokemones por pagina
    const indexOfLastPokemon = currentPage * pokemonsPerPage;//indice del ultimo pokemon
    const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;//indice del primer pokemon
    const currentPokemons = filteredPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);//pokemones actuales en la pagina actual 
    


    const fetchPokemonsFromDB = async () => { //funcion para obtener los pokemones de la base de datos
        try {
            const response = await axios.get('http://localhost:3001/pokemons'); //obtener la respuesta de los pokemones
            const pokemonDetails = await Promise.all(
                response.data.map(async (pokemon, id) => { //mapeo de los pokemones para obtener sus detalles
                    if (pokemon.url && pokemon.url.startsWith('http')) { //si la url del pokemon es valida
                        const pokemonResponse = await axios.get(pokemon.url);//obtener la respuesta del pokemon
                        const image = pokemonResponse.data.sprites.front_default;//obtener la imagen del pokemon
                        const types = pokemonResponse.data.types.map(type => type.type.name);//obtener los tipos del pokemon
                        return { //devolver el pokemon con sus detalles
                            ...pokemon, //devolver el pokemon
                            id: id + 1, //devolver el id
                            image: image,//devolver la imagen
                            types: types//devolver los tipos 
                        };
                    } else {// Si pokemon.url no es una URL válida, devolver el pokemon tal como está
                        return pokemon;
                    }
                })
            );
            setPokemons(pokemonDetails);//setear los pokemones con sus detalles 
            setFilteredPokemons(pokemonDetails);//setear los pokemones filtrados con sus detalles 
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    useEffect(() => {//useEffect para obtener los pokemones de la base de datos 
        fetchPokemonsFromDB();
    }, []);
    


    const handleSearch = () => {//funcion para buscar pokemones 
        let result = pokemons;//resultado de los pokemones 
    
        if (searchTerm) {//si hay un termino de busqueda 
            result = result.filter(pokemon => pokemon.name && pokemon.name.includes(searchTerm));//filtrar los pokemones por el termino de busqueda
        }
    
        if (filterType) {//si hay un tipo de filtro 
            result = result.filter(pokemon => pokemon.types && pokemon.types.includes(filterType));//filtrar los pokemones por el tipo de filtro
        }
    
        if (filterOrigin) {//si hay un origen de filtro 
            if (filterOrigin === 'api') {//si el origen es de la api 
                result = result.filter(pokemon => pokemon.url && pokemon.url.includes('pokeapi.co'));//filtrar los pokemones por la api 
            } else if (filterOrigin === 'database') {//si el origen es de la base de datos 
                result = result.filter(pokemon => pokemon.url && !pokemon.url.includes('pokeapi.co'));//filtrar los pokemones por la base de datos
            }
        }
    
        if (sortOption) {//si hay una opcion de ordenar 
            const [field, order] = sortOption.split('-');//separar el campo y el orden 
            result.sort((a, b) => {//ordenar los pokemones
                if (a[field] === null || b[field] === null) {//si el campo es nulo 
                    return 0;//devolver 0
                }
                if (order === 'asc') {//si el orden es ascendente
                    return a[field] > b[field] ? 1 : -1;//devolver 1 si a es mayor que b, sino -1
                } else {//si el orden es descendente
                    return a[field] < b[field] ? 1 : -1;//devolver 1 si a es menor que b, sino -1
                }
            });
        }
    
        setFilteredPokemons(result);//setear los pokemones filtrados
    };

    useEffect(() => {//useEffect para buscar los pokemones 
        handleSearch();//buscar los pokemones
    }, [sortOption]);//cuando cambie la opcion de ordenar
    
    const handleTypeFilter = (e) => {// funcion para filtrar por tipo
        setFilterType(e.target.value);//setear el tipo de filtro
    };

    const handleOriginFilter = (e) => {//funcion para filtrar por origen        
        setFilterOrigin(e.target.value);// setear el origen de filtro
    };

    const handleNext = () => {// funcion para ir a la siguiente pagina
        if (currentPage < Math.ceil(filteredPokemons.length / pokemonsPerPage)) {// si la pagina actual es menor a la cantidad de paginas
            setCurrentPage(currentPage + 1);// ir a la siguiente pagina
        }
    };
    
    const handlePrevious = () => { // funcion para ir a la pagina anterior
        if (currentPage > 1) { // si la pagina actual es mayor a 1
            setCurrentPage(currentPage - 1); // ir a la pagina anterior
        }
    };
    const handleFirst = () => { // funcion para ir a la primera pagina
        setCurrentPage(1); // ir a la primera pagina
    };
    
    const handleLast = () => { // funcion para ir a la ultima pagina
        setCurrentPage(Math.ceil(filteredPokemons.length / pokemonsPerPage)); // ir a la ultima pagina
    };

    const handleSortChange = (e) => { // funcion para cambiar la opcion de ordenar
        setSortOption(e.target.value); // setear la opcion de ordenar
        handleSearch(); // buscar los pokemones
    };

    const pageNumbers = []; // numeros de pagina
    for (let i = 1; i <= Math.ceil(filteredPokemons.length / pokemonsPerPage); i++) { // para cada pagina
        pageNumbers.push(i); // agregar el numero de pagina
    }
    return ( //retornar el contenido
        <div className="container">         
            
        <div className="home-page"> 
            <video autoPlay muted loop className="background-video">
                <source src={videoSource} type="video/mp4" />
            </video>
            <div className='content'>
                <div className='barra'>
                    <div className='botones'>
                        <Link to="/">
                            <button className="back">Back</button>
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
            <select onChange={handleSortChange}>
                <option value="">Sort by</option>
                <option value="name-desc">Name (A-Z)</option>
                <option value="name-asc">Name (Z-A)</option>
                <option value="attack-asc">Attack (Low-High)</option>
                <option value="attack-desc">Attack (High-Low)</option>
            </select>
            <div className='botones'>
                <Link to="/create">
                <button className="agregar">Agregar</button>
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
                    <button className="pageButton" onClick={handleFirst}>Primera</button>
                    <button className="pageButton" onClick={handlePrevious}>&lt;</button>
                    <button className="pageButton" onClick={handleNext}>&gt;</button>
                    <button className="pageButton" onClick={handleLast}>Última</button>
                </div>
            </div>
        </div>
    </div>
);
}
export default HomePage;