'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm dữ liệu cho bảng 'departments' và lưu lại ID
    await queryInterface.bulkInsert('departments', [
      { department_name: 'HR', createdAt: new Date(), updatedAt: new Date() },
      { department_name: 'Engineering', createdAt: new Date(), updatedAt: new Date() },
      { department_name: 'Sales', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // Lấy department_id của HR và Engineering
    const departments = await queryInterface.sequelize.query(
      `SELECT id, department_name from departments WHERE department_name IN ('HR', 'Engineering');`
    );

    const hrDepartmentId = departments[0].find(d => d.department_name === 'HR').id;
    const engineeringDepartmentId = departments[0].find(d => d.department_name === 'Engineering').id;

    // Thêm dữ liệu cho bảng 'employees'
    const employees = await queryInterface.bulkInsert('employees', [
      {
        full_name: 'Admin User',
        dob: '1985-01-15',
        gender: 1,
        phone_number: '123456789',
        address: '123 Main St',
        department_id: hrDepartmentId,  // Gán vào phòng HR
        dependent_number: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        full_name: 'Test User',
        dob: '1990-06-20',
        gender: 2,
        phone_number: '987654321',
        address: '456 Elm St',
        department_id: engineeringDepartmentId,  // Gán vào phòng Engineering
        dependent_number: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Lấy employee IDs
    const employeeIds = await queryInterface.sequelize.query(
      `SELECT id from employees ORDER BY id ASC LIMIT 2;`
    );
    const [firstEmployeeId, secondEmployeeId] = [employeeIds[0][0].id, employeeIds[0][1].id];

    // Thêm dữ liệu cho bảng 'accounts'
    await queryInterface.bulkInsert('accounts', [
      {
        email: 'admin@gmail.com',
        pass_word: '12345678',
        employee_id: firstEmployeeId,
        type: 1,  // Admin
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user@gmail.com',
        pass_word: '12345678',
        employee_id: secondEmployeeId,
        type: 2,  // Normal user
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Thêm dữ liệu cho bảng 'salaries'
    await queryInterface.bulkInsert('salaries', [
      {
        employee_id: firstEmployeeId,
        base_salary: 5000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        employee_id: secondEmployeeId,
        base_salary: 7000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Thêm dữ liệu cho bảng 'month_salaries'
    await queryInterface.bulkInsert('month_salaries', [
      {
        employee_id: firstEmployeeId,
        month: '10',
        year: '2024',
        salary: 5000,
        deduction: 200,
        total_salary: 4800,
        tax: 500,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        employee_id: secondEmployeeId,
        month: '10',
        year: '2024',
        salary: 7000,
        deduction: 300,
        total_salary: 6700,
        tax: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Xóa dữ liệu cho bảng 'month_salaries'
    await queryInterface.bulkDelete('month_salaries', null, {});

    // Xóa dữ liệu cho bảng 'salaries'
    await queryInterface.bulkDelete('salaries', null, {});

    // Xóa dữ liệu cho bảng 'accounts'
    await queryInterface.bulkDelete('accounts', null, {});

    // Xóa dữ liệu cho bảng 'employees'
    await queryInterface.bulkDelete('employees', null, {});

    // Xóa dữ liệu cho bảng 'departments'
    await queryInterface.bulkDelete('departments', null, {});
  }
};
