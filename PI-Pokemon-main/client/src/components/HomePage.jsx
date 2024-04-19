import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HomePage.css";
import { Link } from "react-router-dom";
import videoSource from "../Media/pokemon-emerald-waterfall-pixel-moewalls-com.mp4";
import defaultImage from "../Media/pokemonchido.jpg";
const HomePage = () => {
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); //termino de busqueda
  const [filterType, setFilterType] = useState(""); //tipo de filtro
  const [originFilter, setFilterOrigin] = useState(""); //origen de filtro
  const [sortOption, setSortOption] = useState(""); //opcion de ordenar
  const [pokemons, setPokemons] = useState([]); //pokemones
  const [filteredPokemons, setFilteredPokemons] = useState([]); //pokemones filtrados
  const [currentPage, setCurrentPage] = useState(1); //pagina actual
  const pokemonsPerPage = 12; //pokemones por pagina
  const indexOfLastPokemon = currentPage * pokemonsPerPage; //indice del ultimo pokemon
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage; //indice del primer pokemon
  const currentPokemons = filteredPokemons.slice(
    indexOfFirstPokemon,
    indexOfLastPokemon
  ); //pokemones actuales en la pagina actual

  const fetchPokemonsFromDB = async () => {
    try {
      const response = await axios.get("http://localhost:3001/pokemons");
      const pokemonAPIResponse = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100");
      
      const pokemonDetails = await Promise.all(
        [...response.data, ...pokemonAPIResponse.data.results].map(async (pokemon, id) => {
          if (pokemon.url && pokemon.url.startsWith("http")) {
            const pokemonResponse = await axios.get(pokemon.url);
            const image = pokemonResponse.data.sprites.front_default;
            const types = pokemonResponse.data.types.map(
              (type) => type.type.name
            );
            const attack = pokemonResponse.data.stats.find(
              (stat) => stat.stat.name === "attack"
            ).base_stat;
            return {
              ...pokemon,
              id: id + 1,
              image: image, // Usa la imagen de la API para los pokemones de la API
              types: types,
              attack: attack,
              source: 'api',
            };
          } else {
            return {
              ...pokemon,
              image: defaultImage, // Usa la imagen predeterminada para los pokemones de la base de datos
              source: 'database',
            };
          }
        })
      );
      setPokemons(pokemonDetails);
      setFilteredPokemons(pokemonDetails);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  useEffect(() => {
    //useEffect para obtener los pokemones de la base de datos y de la API de Pokémon
    fetchPokemonsFromDB();
  }, []);

  const handleSearch = () => {
    //funcion para buscar pokemones por nombre, tipo, origen y ordenar
    let result = pokemons; //resultado de los pokemones

    if (searchTerm) {
      //si hay un termino de busqueda
      result = result.filter(
        (pokemon) => pokemon.name && pokemon.name.includes(searchTerm)
      ); //filtrar los pokemones por el termino de busqueda
    }

    if (filterType) {
      //si hay un tipo de filtro
      result = result.filter(
        (pokemon) => pokemon.types && pokemon.types.includes(filterType)
      ); //filtrar los pokemones por el tipo de filtro
    }

    if (originFilter === 'database') {
      result = result.filter(pokemon => pokemon.source === 'database');
    } else if (originFilter === 'api') {
      result = result.filter(pokemon => pokemon.source === 'api');
    }

    if (sortOption) {//ordenar por letra
      const [field, order] = sortOption.split("-"); //separar el campo y el orden
      result.sort((a, b) => {
        //ordenar los pokemones
        if (a[field] === null || b[field] === null) {
          //si el campo es nulo
          return 0; //devolver 0
        }
        if (order === "asc") {
          //si el orden es ascendente
          return a[field] > b[field] ? 1 : -1; //devolver 1 si a es mayor que b, sino -1
        } else {
          //si el orden es descendente
          return a[field] < b[field] ? 1 : -1; //devolver 1 si a es menor que b, sino -1
        }
      });
    }

    setFilteredPokemons(result); //setear los pokemones filtrados
  };

  const handleTypeFilter = (e) => {
    // funcion para filtrar por type
    setFilterType(e.target.value); //setear el tipo de filtro
  };

  const handleOriginFilter = (e) => {
    //funcion para filtrar por origen Api o Database
    setFilterOrigin(e.target.value); // setear el origen de filtro
  };

  const handleNext = () => {
    // funcion para ir a la siguiente pagina
    if (currentPage < Math.ceil(filteredPokemons.length / pokemonsPerPage)) {
      // si la pagina actual es menor a la cantidad de paginas
      setCurrentPage(currentPage + 1); // ir a la siguiente pagina
    }
  };

  const handlePrevious = () => {
    // funcion para ir a la pagina anterior
    if (currentPage > 1) {
      // si la pagina actual es mayor a 1
      setCurrentPage(currentPage - 1); // ir a la pagina anterior
    }
  };
  const handleFirst = () => {
    // funcion para ir a la primera pagina
    setCurrentPage(1); // ir a la primera pagina
  };

  const handleLast = () => {
    // funcion para ir a la ultima pagina
    setCurrentPage(Math.ceil(filteredPokemons.length / pokemonsPerPage)); // ir a la ultima pagina
  };

  const handleSortChange = (e) => {
    // funcion para cambiar la opcion de ordenar por nombre o ataque
    setSortOption(e.target.value); // setear la opcion de ordenar
    handleSearch(); // buscar los pokemones
  };

  useEffect(() => {
    axios.get("http://localhost:3001/types")
      .then(response => setTypes(response.data));
  }, []);
  
  return (
    //retornar el contenido
    <div className="container">
      <div className="home-page">
        <video autoPlay muted loop className="background-video">
          <source src={videoSource} type="video/mp4" />
        </video>
        <div className="content">
          <div className="barra">
            <div className="botones">
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
  {types.map(type => (
    <option key={type.id} value={type.name}>{type.name}</option>
  ))}
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
              <option value="attack-asc">Attack (High-Low)</option>
              <option value="attack-desc">Attack (Low-High)</option>
            </select>
            <div className="botones">
              <Link to="/create">
                <button className="agregar">Agregar</button>
              </Link>
            </div>
          </div>
          <div className="pokemonCard">
            {currentPokemons.map((pokemon) => (
              <Link to={`/pokemon/${pokemon.id}`} key={pokemon.id}>
                <div
                  className="individualCard"
                >
                  <img src={pokemon.image} alt={pokemon.name} />
                  <p>Name: {pokemon.name}</p>
                  <p>
                    Types:{" "}
                    {pokemon.types
                      ? pokemon.types.join(", ")
                      : "No types available"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div>
            <button className="pageButton" onClick={handleFirst}>
              Primera
            </button>
            <button className="pageButton" onClick={handlePrevious}>
              &lt;
            </button>
            <button className="pageButton" onClick={handleNext}>
              &gt;
            </button>
            <button className="pageButton" onClick={handleLast}>
              Última
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
