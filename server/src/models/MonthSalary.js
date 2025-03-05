'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class MonthSalary extends Model {
    static associate(models) {
      MonthSalary.belongsTo(models.Employee, { foreignKey: 'employee_id', as: 'employee' });
    }
  }

  MonthSalary.init({
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
    month: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deduction: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    salary: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    total_salary: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    tax: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'MonthSalary',
    tableName: 'month_salaries',
    timestamps: true
  });

  return MonthSalary;
};
