const { Pokemon, Type } = require("../db.js");

const findAllPokemons = async (query) => {
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
  
  return DbPokemon;
};

module.exports = findAllPokemons;