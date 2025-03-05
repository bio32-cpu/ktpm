'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.Department, { foreignKey: 'department_id', as: 'department' });
      Employee.hasOne(models.Account, { foreignKey: 'employee_id', as: 'account' });
      Employee.hasMany(models.MonthSalary, { foreignKey: 'employee_id', as: 'monthSalaries' });
      Employee.hasOne(models.Salary, { foreignKey: 'employee_id', as: 'salary' });
    }
  }

  Employee.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    department_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    dependent_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: true
  });

  return Employee;
};
