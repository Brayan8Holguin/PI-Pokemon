import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './FormPage.css';

const FormPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        life: '',
        attack: '',
        defense: '',
        speed: '',
        height: '',
        weight: '',
        types: [],
    });
    const [error, setError] = useState(null);
    const history = useHistory();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch('http://localhost:3001/pokemons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error);
                    });
                }
                return response.json();
            })
            .then(data => {
    history.push('/home');
})
.catch(error => {
    setError(error.message);
});
    };

    const handleTypeChange = (e) => {
        const { options } = e.target;
        const selectedTypes = Array.from(options).filter(option => option.selected).map(option => option.value);
        setFormData(prevData => ({
            ...prevData,
            types: selectedTypes,
        }));
    };

    const { name, image, life, attack, defense, speed, height, weight, types } = formData;

    return (
        <div className='contenedor'>
            {error && <p>{error}</p>} {/* Muestra el mensaje de error si existe */}
            
            
            <header className='header'>
            <nav>
                <ul>
                    <li>
                        <Link className="botonHome" to="/home">Home</Link>
                    </li>
                </ul>
            </nav>
        </header>




            <form className='formulario' onSubmit={handleSubmit}>
             <div>
                <h1 className='Create'>Create a New Pokemon</h1>
            </div>
                <label className='Create'>
                    Name:
                    <input type="text" name="name" value={name} onChange={handleChange} required />
                </label>

                <br />

                <label className='Create'>
                    Image:
                    <input type="text" name="image" value={image} onChange={handleChange} required />
                </label>

                <br />

                <label className='Create'>
                    Life:
                    <input type="number" name="life" value={life} onChange={handleChange} required />
                </label>

                <br />

                <label className='Create'>
                    Attack:
                    <input type="number" name="attack" value={attack} onChange={handleChange} required />
                </label>

                <br />

                <label className='Create'>
                    Defense:
                    <input type="number" name="defense" value={defense} onChange={handleChange} required />
                </label>
                
                <br />
                <label className='Create'>
                    Speed:
                    <input type="number" name="speed" value={speed} onChange={handleChange} />
                </label>

                <br />
                <label className='Create'>
                    Height:
                    <input type="number" name="height" value={height} onChange={handleChange} />
                </label>

                <br />
                <label className='Create'>
                    Weight:
                    <input type="number" name="weight" value={weight} onChange={handleChange} />
                </label>

                <br />
                <label className='Create'>
                    Types:
                    <br />
                    <select multiple name="types" value={types} onChange={handleTypeChange}>
                        <option value="fire">Fire</option>
                        <option value="water">Water</option>
                        <option value="grass">Grass</option>
                        <option value="electric">Electric</option>
                        <option value="ice">Ice</option>
                        <option value="fighting">Fighting</option>
                        <option value="poison">Poison</option>
                        {/* Añade más opciones según los tipos de Pokemon que tengas */}
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