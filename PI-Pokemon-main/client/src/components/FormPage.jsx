import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import "./FormPage.css";

const typeToId = {
  normal: 1,
  fighting: 2,
  flying: 3,
  poison: 4,
  ground: 5,
  rock: 6,
  bug: 7,
  ghost: 8,
  steel: 9,
  fire: 10,
  water: 11,
  grass: 12,
  electric: 13,
  psychic: 14,
  ice: 15,
  dragon: 16,
  dark: 17,
  fairy: 18,
  unknown: 19,
  shadow: 20,
};

function FormPage() {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios
      .get("localHost:3001/types")
      .then((response) => {
        setTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching types", error);
      });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    hp: "",
    attack: "",
    defense: "",
    speed: "",
    height: "",
    weight: "",
    types: "",
  });
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleChange = (event) => {
    const { name, options } = event.target;

    if (options) {
      let value = [];

      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          value.push(typeToId[options[i].value]);
        }
      }

      setFormData({ ...formData, [name]: value });
    } else {
      const { value } = event.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/pokemons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error);
      }

      const data = await response.json();
      history.push(`/pokemon/${data.id}`);
    } catch (error) {
      setError(error.message);
    }
  };

  const { name, life, attack, defense, speed, height, weight, types: typesData } =
    formData;

  return (
    <div className="contenedor">
      {error && <p>{error}</p>}
      <header className="header">
        <nav>
          <ul>
            <li>
              <Link className="botonHome" to="/home">
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <form className="formulario" onSubmit={handleSubmit}>
        <div>
          <h1 className="Create">Create a New Pokemon</h1>
        </div>
        <label className="Create">
          Name:
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            required
          />
        </label>

        <br />

        <label className="Create">
          Life:
          <input
            type="number"
            name="hp"
            value={life}
            onChange={handleChange}
            required
          />
        </label>

        <br />

        <label className="Create">
          Attack:
          <input
            type="number"
            name="attack"
            value={attack}
            onChange={handleChange}
            required
          />
        </label>

        <br />

        <label className="Create">
          Defense:
          <input
            type="number"
            name="defense"
            value={defense}
            onChange={handleChange}
            required
          />
        </label>

        <br />
        <label className="Create">
          Speed:
          <input
            type="number"
            name="speed"
            value={speed}
            onChange={handleChange}
          />
        </label>

        <br />
        <label className="Create">
          Height:
          <input
            type="number"
            name="height"
            value={height}
            onChange={handleChange}
          />
        </label>

        <br />
        <label className="Create">
          Weight:
          <input
            type="number"
            name="weight"
            value={weight}
            onChange={handleChange}
          />
        </label>

        <br />
        <label className="Create">
          Type:
          <select>
            {types.map((type, index) => (
              <option key={index} value={type.data}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <br />
        <br />

        <button type="submit">Create Pokemon</button>
      </form>
    </div>
  );
}

export default FormPage;
