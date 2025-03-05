import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiPlusCircle } from "react-icons/fi";
import { FaSort } from "react-icons/fa";
import * as apiService from "../services";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from "../components/Spinner";
import { confirmFunction } from "../ultils/confirmFunction";
import { handleCheckError } from "../ultils/checkFunction";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [paginatedEmployees, setPaginatedEmployees] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 5;
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true)
  const [newEmployee, setNewEmployee] = useState({
    full_name: "",
    dob: "",
    gender: 1,
    phone_number: "",
    address: "",
    dependent_number: 0,
    department_id: 0,
    updatedAt: new Date().toISOString(),
  });

  const { token } = useSelector(state => state.auth);
  const department_id = token ? jwtDecode(token)?.department_id : null;
  const type = token ? jwtDecode(token)?.type : 0;


  useEffect(() => {
    fetchData();
    console.log(department_id)
  }, [department_id]);

  const fetchData = async () => {
    try {
      const [employeeResponse, departmentResponse] = await Promise.all([
        apiService.apiAllEmployees(type === 1 ? { department_id: department_id } : {}),
        apiService.apiAllDepartment()
      ]);

      if (
        employeeResponse?.status === 200 &&
        employeeResponse?.data?.err === 0 &&
        departmentResponse?.status === 200 &&
        departmentResponse?.data?.err === 0
      ) {
        setEmployees(employeeResponse.data.data);
        setDepartments(departmentResponse.data.data);
      } else {
        toast.warn("Không thể tải dữ liệu.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Lỗi khi tải dữ liệu.");
    }
    setIsLoading(false)
  };

  useEffect(() => {
    const filtered = employees
      .filter(employee =>
        employee.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });

    setFilteredEmployees(filtered);
    setPaginatedEmployees(filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [employees, searchTerm, sortConfig, currentPage]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending"
    });
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (handleCheckError(newEmployee)) return;
    setIsLoading(true)
    try {
      const response = await apiService.apiCreateEmployee(newEmployee);
      if (response?.status === 200 && response?.data?.err === 0) {
        setShowAddModal(false);
        await fetchData();
        setNewEmployee({
          full_name: "",
          dob: "",
          gender: 1,
          phone_number: "",
          address: "",
          dependent_number: 0,
          department_id: 0,
          updatedAt: new Date().toISOString(),
        });
      } else {
        toast.warn(response?.data?.msg);
      }
    } catch (error) {
      console.error("Error adding data:", error);
      toast.error("Lỗi khi thêm mới dữ liệu.");
    }
    setIsLoading(false)
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (handleCheckError(editingEmployee)) return;
    setIsLoading(true)
    try {
      const response = await apiService.apiUpdateEmployee(editingEmployee);
      if (response?.status === 200 && response?.data?.err === 0) {
        await fetchData();
        setShowModal(false);
        setEditingEmployee(null);
      } else {
        toast.warn(response?.data?.msg);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Lỗi khi cập nhật dữ liệu.");
    }
    setIsLoading(false)
  };

  const handleDelete = async (id) => {
    await confirmFunction(() => { handleDeleteApi(id) })
  };

  const handleDeleteApi = async (id) => {
    setIsLoading(true)
    try {
      const response = await apiService.apiDeleteEmployee({ id });
      if (response?.status === 200 && response?.data?.err === 0) {
        await fetchData();
      } else {
        toast.warn(response?.data?.msg);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Lỗi khi xóa dữ liệu.");
    }
    setIsLoading(false)
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      <ToastContainer />
      <Spinner
        isOpen={isLoading}
        onClose={() => setIsLoading(false)}
        message="Loading....."
      />
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <FiSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            className="py-2 pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <FiPlusCircle />
          <span>Thêm mới</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {[
                { label: "Họ tên", key: "full_name" },
                { label: "Ngày sinh", key: "dob" },
                { label: "Giới tính", key: "gender" },
                { label: "Số điện thoại", key: "phone_number" },
                { label: "Địa chỉ", key: "address" },
                { label: "Phòng ban", key: "department.department_name" },
                { label: "Phụ thuộc", key: "dependent_number" },
                { label: "Cập nhật", key: "updatedAt" }
              ].map(({ label, key }) => (
                <th
                  key={key}
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    <FaSort className="text-gray-400" />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{employee.full_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{new Date(employee.dob).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{employee.gender === 0 ? "Nam" : "Nữ"}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{employee.phone_number}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{employee.address}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{employee.department?.department_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{employee.dependent_number}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{new Date(employee.updatedAt).toLocaleString()}</td>
                <td className="px-6 py-4 space-x-4 text-sm font-medium whitespace-nowrap">
                  <button onClick={() => handleEdit(employee)} className="text-blue-600 hover:text-blue-900" aria-label="Edit employee">
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(employee.id)} className="text-red-600 hover:text-red-900" aria-label="Delete employee">
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Hiển thị trang {((currentPage - 1) * itemsPerPage) + 1} với {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} / {filteredEmployees.length} kết quả
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer disabled:opacity-50">
            <FiChevronLeft />
          </button>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer disabled:opacity-50">
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Edit and Add Modals - Similar to your original code */}
      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg w-[700px]">
            <h2 className="mb-4 text-xl font-bold">Cập nhật thông tin</h2>
            <form onSubmit={handleSave}>
              <div className="flex flex-row items-start gap-5 space-y-4">
                <div className="flex flex-col w-full mt-4">
                  <label className="block mt-2 text-sm font-medium text-gray-700">Họ và tên</label>
                  <input
                    type="text"
                    value={editingEmployee.full_name}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, full_name: e.target.value })}
                    className="w-full p-2 border rounded"
                  />

                  <label className="block mt-2 text-sm font-medium text-gray-700">Ngày sinh</label>
                  <input
                    type="date"
                    value={editingEmployee.dob?.split('T')[0]}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, dob: e.target.value })}
                    className="w-full p-2 border rounded"
                  />

                  <label className="block mt-2 text-sm font-medium text-gray-700">Giới tính</label>
                  <select
                    value={editingEmployee.gender}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, gender: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                  >
                    <option value={0}>Nam</option>
                    <option value={1}>Nữ</option>
                  </select>
                </div>

                <div className="flex flex-col w-full">
                  <label className="block mt-2 text-sm font-medium text-gray-700">Số điện thoại</label>
                  <input
                    type="text"
                    value={editingEmployee.phone_number}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, phone_number: e.target.value })}
                    className="w-full p-2 border rounded"
                  />

                  <label className="block mt-2 text-sm font-medium text-gray-700">Địa chỉ</label>
                  <input
                    type="text"
                    value={editingEmployee.address}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, address: e.target.value })}
                    className="w-full p-2 border rounded"
                  />

                  <label className="block mt-2 text-sm font-medium text-gray-700">Phòng ban</label>
                  <select
                    value={editingEmployee.department_id}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, department_id: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Chọn phòng ban</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.department_name}
                      </option>
                    ))}
                  </select>

                  <label className="block mt-2 text-sm font-medium text-gray-700">Số người phụ thuộc</label>
                  <input
                    type="number"
                    min="0"
                    value={editingEmployee.dependent_number}
                    onChange={(e) => setEditingEmployee({
                      ...editingEmployee,
                      dependent_number: parseInt(e.target.value) || 0 // Đảm bảo không lưu giá trị NaN
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg w-[700px]">
            <h2 className="mb-4 text-xl font-bold">Thêm mới</h2>
            <form onSubmit={handleAdd}>
              <div className="flex flex-row items-start gap-5 space-y-4">
                <div className="flex flex-col w-full mt-4">
                  <label className="block mt-2 text-sm font-medium text-gray-700">Họ và tên</label>
                  <input
                    type="text"
                    value={newEmployee.full_name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, full_name: e.target.value })}
                    className="w-full p-2 border rounded"
                  />

                  <label className="block mt-2 text-sm font-medium text-gray-700">Ngày sinh</label>
                  <input
                    type="date"
                    value={newEmployee.dob}
                    onChange={(e) => setNewEmployee({ ...newEmployee, dob: e.target.value })}
                    className="w-full p-2 border rounded"
                  />

                  <label className="block mt-2 text-sm font-medium text-gray-700">Giới tính</label>
                  <select
                    value={newEmployee.gender}
                    onChange={(e) => setNewEmployee({ ...newEmployee, gender: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                  >
                    <option value={0}>Nam</option>
                    <option value={1}>Nữ</option>
                  </select>
                </div>

                <div className="flex flex-col w-full">
                  <label className="block mt-2 text-sm font-medium text-gray-700">Số điện thoại</label>
                  <input
                    type="text"
                    value={newEmployee.phone_number}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone_number: e.target.value })}
                    className="w-full p-2 border rounded"
                  />

                  <label className="block mt-2 text-sm font-medium text-gray-700">Địa chỉ</label>
                  <input
                    type="text"
                    value={newEmployee.address}
                    onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                    className="w-full p-2 border rounded"
                  />

                  <label className="block mt-2 text-sm font-medium text-gray-700">Phòng ban</label>
                  <select
                    value={newEmployee.department_id}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department_id: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Chọn phòng ban</option>
                    {departments.filter((val) => val.id === department_id).map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.department_name}
                      </option>
                    ))}
                  </select>

                  <label className="block mt-2 text-sm font-medium text-gray-700">Số người phụ thuộc</label>
                  <input
                    type="number"
                    min="0"
                    value={newEmployee.dependent_number}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        dependent_number: parseInt(e.target.value) || 0, // Đảm bảo giá trị không là NaN
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Thêm mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
