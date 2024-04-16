const DataTypes = require('sequelize').DataTypes;
module.exports = (sequelize) => {
  sequelize.define('type', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}