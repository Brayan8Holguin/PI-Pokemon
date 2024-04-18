const { Router } = require("express");
const { Pokemon, Type } = require("../db");
const findAllPokemons = require("../controllers/findAllPokemons");
const axios = require("axios");
const { createPokemon } = require("../controllers/createPokemon");

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get("/pokemons", async (req, res) => {
  try {
    const allPokemons = await findAllPokemons();
    res.status(200).json(allPokemons);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "No se encontraron pokemons" });
  }
});

router.get("/pokemons/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (id >= 984) {
      const pokemon = await Pokemon.findByPk(id, { include: Type });
      if (pokemon) {
        res.status(200).json(pokemon);
      } else {
        res
          .status(404)
          .json({ error: "No se encontró el pokemon en la base de datos" });
      }
    } else {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${id}`
      );
      if (response.data) {
        res.status(200).json(response.data);
      } else {
        res.status(404).json({ error: "No se encontró el pokemon en la API" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "No se encontraron pokemons" });
  }
});

router.get("/pokemons/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const pokemon = await Pokemon.findOne({
      where: { name: { [Op.iLike]: `%${name}%` } },
    });
    if (pokemon) {
      res.status(200).json(pokemon);
    } else {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      );
      res.status(200).json(response.data);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "No se encontraron pokemons" });
  }
});

let lastId = 983; // Inicia en 982 para que el primer ID asignado sea 983

router.post("/pokemons", async (req, res) => {
  try {
    const { name, hp, attack, defense, speed, height, weight, types } =
      req.body;
    lastId++; // Incrementa el ID
    const newPokemon = await createPokemon({
      id: lastId,
      name,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
      types,
    });
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(400).json({ error: "No se pudo crear el pokemon" });
  }
});
router.get("/types", async (req, res) => {
  try {
    const response = await axios.get("https://pokeapi.co/api/v2/type");
    const types = response.data.results;
    res.status(200).json(types);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "No se encontraron tipos de pokemon" });
  }
});

module.exports = router;
