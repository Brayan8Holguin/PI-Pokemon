const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // Defino el modelo
  const Type = sequelize.define("type", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Type; // Devuelve la definición del modelo
};