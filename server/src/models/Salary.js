'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Salary extends Model {
    static associate(models) {
      Salary.belongsTo(models.Employee, { foreignKey: 'employee_id', as: 'employee' });
    }
  }

  Salary.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    employee_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    base_salary: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Salary',
    tableName: 'salaries',
    timestamps: true
  });

  return Salary;
};
