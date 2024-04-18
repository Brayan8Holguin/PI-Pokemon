const { Pokemon } = require("../db.js");
const axios = require("axios");

const findAllPokemons = async (req, res) => {
  const response = await axios.get(
    "https://pokeapi.co/api/v2/pokemon?limit=983"
  );
  const apiPokemon = response.data.results;
  const DbPokemon = await Pokemon.findAll();
  const pokemon = apiPokemon.concat(DbPokemon);
  return pokemon;
};

module.exports = findAllPokemons;
