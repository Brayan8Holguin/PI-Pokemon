const axios = require('axios');
const { Pokemon, Type } = require("../db.js");

const findAllPokemons = async (query) => {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
  const apiPokemons = response.data.results;
  const DbPokemon = await Pokemon.findAll({ 
    where: query,
    include: {
      model: Type,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    }
  });
  
  const allPokemons = apiPokemons.concat(DbPokemon);

  return allPokemons;
};

module.exports = findAllPokemons;