'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('month_salaries', {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      employee_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      month: {
        type: Sequelize.STRING,
        allowNull: false
      },
      year: {
        type: Sequelize.STRING,
        allowNull: false
      },
      salary: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      deduction: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      total_salary: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      tax: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('month_salaries');
  }
};
