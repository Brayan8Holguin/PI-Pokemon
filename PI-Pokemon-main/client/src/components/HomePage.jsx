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
      const pokemonAPIResponse = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=100"
      );
  
      const pokemonDetails = await Promise.all(//promesa para obtener los detalles de los pokemones
        [...response.data, ...pokemonAPIResponse.data.results].map(//mapear los pokemones
          async (pokemon, id) => {//funcion asincrona para obtener los detalles de los pokemones
            if (pokemon.url && pokemon.url.startsWith("http")) { //si la url del pokemon empieza con http
              const pokemonResponse = await axios.get(pokemon.url); //obtener la respuesta del pokemon
              const image = pokemonResponse.data.sprites.front_default; //imagen del pokemon
              const types = pokemonResponse.data.types.map( //tipos del pokemon 
                (type) => type.type.name //nombre del tipo del pokemon 
              );
              const attack = pokemonResponse.data.stats.find( //ataque del pokemon
                (stat) => stat.stat.name === "attack" //nombre del ataque del pokemon
              ).base_stat; //estadistica base del ataque del pokemon 
              return { 
                ...pokemon, 
                id: pokemonResponse.data.id, // Usa el ID de la API para los pokemones de la API
                image: image, //imagen del pokemon
                types: types, //tipos del pokemon
                attack: attack, //ataque del pokemon
                source: "api",  //origen del pokemon
              };
            } else {
              return {  //si no tiene url
                ...pokemon, 
                id: pokemon.id, // Usa el UUID de la base de datos para los pokemones de la base de datos
                image: defaultImage, //imagen por defecto
                source: "database", //origen de la base de datos
              };
            }
          }
        )
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

  useEffect(() => {
    let result = [...pokemons];
  
    if (sortOption) {
      // Ordenar por letra
      const [field, order] = sortOption.split("-");
      result.sort((a, b) => {
        if (a[field] === null || b[field] === null) {
          return 0;
        }
        if (a[field] === b[field]) {
          return a.source > b.source ? 1 : -1;
        }
        if (order === "asc") {
          return a[field] > b[field] ? 1 : -1;
        } else {
          return a[field] < b[field] ? 1 : -1;
        }
      });
    }
  
    console.log("Pokemones antes del filtro por tipo:", result);
  
    if (filterType) {
      result = result.filter((pokemon) => {
        if (pokemon.source === "database") {
          // Mapear los tipos de pokemones a un array de strings
          const pokemonTypes = pokemon.types.map(type => type.name);
          return pokemonTypes.includes(filterType);
        } else {
          return pokemon.types.includes(filterType);
        }
      });
    }
  
    console.log("Pokemones después del filtro por tipo:", result);
  
    if (originFilter === "database") {
      result = result.filter((pokemon) => pokemon.source === "database");
    } else if (originFilter === "api") {
      result = result.filter((pokemon) => pokemon.source === "api");
    }
  
    console.log("Pokemones después del filtro por origen:", result);
  
    setFilteredPokemons(result);
  }, [sortOption, filterType, originFilter, pokemons]);

  const handleSortChange = (e) => {
    // funcion para cambiar la opcion de ordenar por nombre o ataque
    setSortOption(e.target.value); // setear la opcion de ordenar
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
  const handleSearchChange = (e) => {
    // establecer el término de búsqueda
    setSearchTerm(e.target.value);
  
    // filtrar los pokemones basándose en el término de búsqueda
    const filtered = pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
  
    // establecer los pokemones filtrados
    setFilteredPokemons(filtered);
  };
 

  useEffect(() => {
    axios
      .get("http://localhost:3001/types")
      .then((response) => setTypes(response.data));
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
  onChange={handleSearchChange}
/>
            <select onChange={handleTypeFilter}>
              <option value="">All types</option>
              {types.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
            <select onChange={handleOriginFilter}>
              <option value="">All origins</option>
              <option value="api">API</option>
              <option value="database">Database</option>
            </select>
            
            <select onChange={handleSortChange}>
              <option value="">Sort by</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="attack-desc">Attack (High-Low)</option>
              <option value="attack-asc">Attack (Low-High)</option>
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
                <div className="individualCard">
                  <img src={pokemon.image} alt={pokemon.name} />
                  <p>Name: {pokemon.name}</p>
                  <p>
                    Types:{" "}
                    {pokemon.types
                      ? typeof pokemon.types[0] === "string"
                        ? pokemon.types.join(", ")
                        : pokemon.types
                            .map((typeObj) => typeObj.name)
                            .join(", ")
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
