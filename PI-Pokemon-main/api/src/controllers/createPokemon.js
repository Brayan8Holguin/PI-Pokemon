const { Pokemon, Type } = require("../db");

const createPokemon = async ({
  name,
  hp,
  attack,
  defense,
  speed,
  height,
  weight,
  types,
}) => {
  const newPokemon = await Pokemon.create({
    name,
    hp,
    attack,
    defense,
    speed,
    height,
    weight,
  });

await newPokemon.addTypes(types);

  return newPokemon;
};

module.exports = createPokemon;