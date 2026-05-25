const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Categoria = sequelize.define("Categoria", {
  id_categoria: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  nombre_categoria: { type: DataTypes.STRING(100), allowNull: false },
  descripcion_categoria: { type: DataTypes.STRING(255), allowNull: true },
}, { tableName: "categoria", timestamps: false });

module.exports = Categoria;