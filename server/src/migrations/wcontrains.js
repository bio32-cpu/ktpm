'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Thêm ràng buộc ngoại tuyến giữa 'accounts' và 'employee'
        await queryInterface.addConstraint('accounts', {
            fields: ['employee_id'], 
            type: 'foreign key',
            name: 'fk_accounts_employee_id', // Tên constraint phải là duy nhất
            references: {
                table: 'employees',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        // Thêm ràng buộc ngoại tuyến giữa 'employee' và 'department'
        await queryInterface.addConstraint('employees', {
            fields: ['department_id'], 
            type: 'foreign key',
            name: 'fk_employee_department_id', 
            references: {
                table: 'departments',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        // Thêm ràng buộc ngoại tuyến giữa 'month_salary' và 'employee'
        await queryInterface.addConstraint('month_salaries', {
            fields: ['employee_id'], 
            type: 'foreign key',
            name: 'fk_month_salary_employee_id',
            references: {
                table: 'employees',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });


        // Thêm ràng buộc ngoại tuyến giữa 'salary' và 'employee'
        await queryInterface.addConstraint('salaries', {
            fields: ['employee_id'], 
            type: 'foreign key',
            name: 'fk_salary_employee_id',
            references: {
                table: 'employees',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    },

    async down(queryInterface, Sequelize) {
        // Xóa ràng buộc ngoại tuyến giữa 'accounts' và 'employee'
        await queryInterface.removeConstraint('accounts', 'fk_accounts_employee_id');

        // Xóa ràng buộc ngoại tuyến giữa 'employee' và 'department'
        await queryInterface.removeConstraint('employees', 'fk_employee_department_id');

        // Xóa ràng buộc ngoại tuyến giữa 'month_salary' và 'employee'
        await queryInterface.removeConstraint('month_salaries', 'fk_month_salary_employee_id');

        // Xóa ràng buộc ngoại tuyến giữa 'salary' và 'employee'
        await queryInterface.removeConstraint('salaries', 'fk_salary_employee_id');
    }
};
