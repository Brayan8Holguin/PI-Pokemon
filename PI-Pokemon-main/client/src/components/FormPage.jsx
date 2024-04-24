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
    types: [],
  });
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:3001/types")
      .then((response) => {
        setTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching types", error);
      });
  }, []);

  const handleChange = (event) => {
    const { name, options, value } = event.target;

    if (name === "types") {
      let value = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          value.push(typeToId[options[i].value]);
        }
      }
      setFormData({ ...formData, types: value });
    } else {
      if (name === "name" && /[^a-zA-Z]/.test(value)) {
        alert("Por favor, ingrese solo letras en el nombre.");
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/pokemons", formData)
      .then((response) => {
        history.push("/home");
      })
      .catch((error) => {
        setError("Error creating pokemon");
      });
  };

  const {
    name,
    life,
    attack,
    defense,
    speed,
    height,
    weight,
    types: typesData,
  } = formData;

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
          <select multiple={true} name="types" onChange={handleChange}>
            {types.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
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
