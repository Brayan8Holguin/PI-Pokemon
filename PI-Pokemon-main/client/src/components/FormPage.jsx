import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./FormPage.css";

const FormPage = () => {
  // Componente para crear un nuevo Pokémon
  const [formData, setFormData] = useState({
    // Estado para guardar los datos del nuevo Pokémon
    name: "", // Valores iniciales
    image: "",
    hp: "",
    attack: "",
    defense: "",
    speed: "",
    height: "",
    weight: "",
    types: [],
  });
  const [error, setError] = useState(null); // Estado para guardar un mensaje de error
  const history = useHistory(); // Hook para redirigir al usuario

  const handleChange = (e) => {
    // Función para manejar los cambios en los inputs
    const { name, value } = e.target; // Extrae el nombre y el valor del input
    setFormData((prevData) => ({
      //  Actualiza el estado con los nuevos valores
      ...prevData, // Mantiene los valores que ya tenía
      [name]: value, // Actualiza el valor que cambió
    }));
  };

  const handleSubmit = (event) => {
    // Función para manejar el envío del formulario
    event.preventDefault(); // Evita que el formulario recargue la página

    fetch("http://localhost:3001/pokemons", {
      // Hace una petición POST al servidor
      method: "POST", // Indica que la petición es de tipo POST
      headers: {
        // Configura los encabezados de la petición
        "Content-Type": "application/json", // Indica que la petición envía datos JSON
      },
      body: JSON.stringify(formData), // Convierte los datos del estado a JSON y los envía
    })
      .then((response) => {
        // Maneja la respuesta del servidor
        if (!response.ok) {
          // Si la respuesta no es exitosa
          return response.json().then((error) => {
            // Convierte el mensaje de error a JSON
            throw new Error(error); // Lanza un error con el mensaje
          }); // Termina el flujo de la función
        }
        return response.json();
      })
      .then((data) => {
        // Redirige al usuario a la página de detalles del nuevo Pokémon
        history.push(`/pokemon/${data.id}`);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleTypeChange = (e) => {
    // Función para manejar los cambios en el select de tipos
    const { options } = e.target; // Extrae las opciones del select
    const selectedTypes = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value); // Filtra las opciones seleccionadas y extrae sus valores
    setFormData((prevData) => ({
      // Actualiza el estado con los nuevos valores
      ...prevData, // Mantiene los valores que ya tenía
      types: selectedTypes, // Actualiza los tipos seleccionados
    }));
  };
  const handleImageChange = (e) => {
    // Función para manejar los cambios en el input de imagen
    if (e.target.files[0]) {
      // Si el usuario seleccionó un archivo
      setFormData((prevData) => ({
        // Actualiza el estado con la nueva imagen
        ...prevData, // Mantiene los valores que ya tenía
        image: URL.createObjectURL(e.target.files[0]), // Crea un URL para la imagen seleccionada
      }));
    }
  };

  const { name, life, attack, defense, speed, height, weight, types } =
    formData; // Extrae los valores del estado para facilitar su uso

  return (
    // Renderiza el formulario
    <div className="contenedor">
      {error && <p>{error}</p>} {/* Muestra el mensaje de error si existe */}
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
          Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
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
          Types:
          <br />
          <select
            multiple
            name="types"
            value={types}
            onChange={handleTypeChange}
          >
            <option value="fire">Fire</option>
            <option value="water">Water</option>
            <option value="grass">Grass</option>
            <option value="electric">Electric</option>
            <option value="ice">Ice</option>
            <option value="fighting">Fighting</option>
            <option value="poison">Poison</option>
            <option value="ground">Ground</option>
            <option value="flying">Flying</option>
            <option value="psychic">Psychic</option>
            <option value="bug">Bug</option>
            <option value="rock">Rock</option>
            <option value="ghost">Ghost</option>
            <option value="dark">Dark</option>
            <option value="dragon">Dragon</option>
            <option value="steel">Steel</option>
            <option value="fairy">Fairy</option>
          </select>
        </label>

        <br />
        <br />

        <button type="submit">Create Pokemon</button>
      </form>
    </div>
  );
};

export default FormPage;
