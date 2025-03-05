import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiPlusCircle } from "react-icons/fi";
import { FaSort } from "react-icons/fa";
import * as apiService from "../services";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from "../components/Spinner";
import { CiCalculator1 } from "react-icons/ci";
import { confirmFunction } from "../ultils/confirmFunction";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [paginatedSalaries, setPaginatedSalaries] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 5;
  const [editingSalary, setEditingSalary] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true)
  const [openCaculate, setOpenCaculate] = useState(false)
  const [caculate, setCaculate] = useState({
    employee_id: "",
    full_name: "",
    month: "",
    year: "",
    salary: 0,
    deduction: 0,
    tax: 0,
    total_salary: 0
  })

  const { token } = useSelector(state => state.auth);
  const department_id = token ? jwtDecode(token)?.department_id : null;
  const type = token ? jwtDecode(token)?.type : 2;

  const [newSalary, setNewSalary] = useState({
    employee_id: "",
    base_salary: 0,
  });

  useEffect(() => {
    fetchData();
    console.log(department_id)
  }, [department_id]);

  function formatToVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  const fetchData = async () => {
    try {
      const [salaryResponse, employeeResponse] = await Promise.all([
        apiService.apiAllSalaries(type === 1 ? { department_id: department_id } : {}),
        apiService.apiAllWithoutSalary()
      ]);

      if (
        salaryResponse?.status === 200 &&
        salaryResponse?.data?.err === 0 &&
        employeeResponse?.status === 200 &&
        employeeResponse?.data?.err === 0
      ) {
        setSalaries(salaryResponse.data.data);
        setEmployees(employeeResponse.data.data);
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
    const filtered = salaries
      .filter(salary =>
        salary.employee?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });

    setFilteredSalaries(filtered);

    const paginated = filtered.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    setPaginatedSalaries(paginated);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [salaries, searchTerm, sortConfig, currentPage]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    handleCreateApi(newSalary);
  };

  const handleCreateApi = async (payload) => {
    setIsLoading(true)
    try {
      const response = await apiService.apiCreateSalary(payload);
      if (response?.status === 200 && response?.data?.err === 0) {
        await fetchData();
        setShowAddModal(false);
        setNewSalary({
          email: "",
          employee_id: "",
          type: 0,
          pass_word: "",
          base_salary: 0,
        });
      } else {
        toast.warn(response?.data?.msg);
      }
    } catch (error) {
      console.error("Error creating salary:", error);
      toast.error("Lỗi khi tạo mới dữ liệu.");
    }
    setIsLoading(false)
  };

  const handleEdit = (salary) => {
    setEditingSalary(salary);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const response = await apiService.apiUpdateSalary(editingSalary);
      if (response?.status === 200 && response?.data?.err === 0) {
        await fetchData();
        setShowModal(false);
        setEditingSalary(null);
      } else {
        toast.warn(response?.data?.msg);
      }
    } catch (error) {
      console.error("Error saving salary:", error);
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
      const response = await apiService.apiDeleteSalary({ id });
      if (response?.status === 200 && response?.data?.err === 0) {
        await fetchData();
      } else {
        toast.warn(response?.data?.msg);
      }
    } catch (error) {
      console.error("Error deleting salary:", error);
      toast.error("Lỗi khi xóa dữ liệu.");
    }
    setIsLoading(false)
  }

  const caculateSalary = (salary) => {
    const ob = apiService.getSalaryTax(salary.base_salary, salary.employee.dependent_number);
    console.log(ob)
    setCaculate({ ...caculate, employee_id: salary.employee.id, full_name: salary.employee.full_name, salary: salary.base_salary, deduction: ob.deduction, tax: ob.tax, total_salary: ob.total_salary })
    setOpenCaculate(true)
  }

  const handleAddMonthSalary = (e) => {
    e.preventDefault();
    handleCreateMontSalaryApi(caculate);
  };

  const handleCreateMontSalaryApi = async (payload) => {
    setIsLoading(true)
    console.log(payload)
    try {
      const response = await apiService.apiCreateMonthSalary(payload);
      if (response?.status === 200 && response?.data?.err === 0) {
        setOpenCaculate(false);
        setCaculate({
          employee_id: "",
          full_name: "",
          month: "",
          year: "",
          salary: 0,
          deduction: 0,
          tax: 0,
          total_salary: 0
        });
      } else {
        toast.warn(response?.data?.msg);
      }
    } catch (error) {
      console.error("Error creating salary:", error);
      toast.error("Lỗi khi thêm mới lương theo tháng.");
    }
    setIsLoading(false)
  };


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
        {
          type === 2 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <FiPlusCircle />
              <span>Thêm mới</span>
            </button>
          )
        }
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {[{ label: "ID", key: "id" },
              { label: "Họ và tên", key: "salary.employee.full_name" },
              { label: "Phòng ban", key: "salary.employee.department.department_name" },
              { label: "Phụ thuộc", key: "salary.employee.dependent_number" },
              { label: "Lương cơ bản", key: "salary.base_salary" }]
                .map(({ label, key }) => (
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
              {
                type === 2 && (
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Hành động
                  </th>
                )
              }
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedSalaries.map((salary) => (
              <tr key={salary.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{salary.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{salary.employee.full_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{salary.employee.department.department_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{salary.employee.dependent_number}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{formatToVND(salary.base_salary)}</td>
                {
                  type === 2 && (
                    <td className="px-6 py-4 space-x-4 text-sm font-medium whitespace-nowrap">
                      <button onClick={() => handleEdit(salary)} className="text-blue-600 hover:text-blue-900" aria-label="Edit salary">
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => { caculateSalary(salary) }}
                        className="text-green-600 hover:text-green-900" aria-label="Change password">
                        <CiCalculator1 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(salary.id)} className="text-red-600 hover:text-red-900" aria-label="Delete salary">
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  )
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Hiển thị trang {((currentPage - 1) * itemsPerPage) + 1} với {Math.min(currentPage * itemsPerPage, filteredSalaries.length)} / {filteredSalaries.length} kết quả
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer disabled:opacity-50"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer disabled:opacity-50"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg w-96">
            <h2 className="mb-4 text-xl font-bold">Sửa thông tin</h2>
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID</label>
                  <input
                    type="text"
                    className="block w-full p-2 mt-1 bg-gray-200 border border-gray-300 rounded-md shadow-sm"
                    value={editingSalary.id}
                    onChange={(e) => setEditingSalary({ ...editingSalary, id: e.target.value })}
                    disabled={true}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên nhân viên</label>
                  <input
                    type="text"
                    className="block w-full p-2 mt-1 bg-gray-200 border border-gray-300 rounded-md shadow-sm"
                    value={editingSalary.employee.full_name}
                    onChange={(e) =>
                      setEditingSalary({ ...editingSalary, employee: { ...editingSalary.employee, full_name: e.target.value } })
                    }
                    disabled={true}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lương cơ bản</label>
                  <input
                    type="number"
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={editingSalary.base_salary || 0}
                    onChange={(e) => setEditingSalary({ ...editingSalary, base_salary: parseInt(e.target.value) })}
                    required
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

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg w-96">
            <h2 className="mb-4 text-xl font-bold">Thêm mới thông tin</h2>
            <form onSubmit={handleAdd}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nhân viên</label>
                  <select
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={newSalary.employee_id || ""}
                    onChange={(e) => setNewSalary({ ...newSalary, employee_id: e.target.value })}
                    required
                  >
                    <option value="">Chọn nhân viên</option>
                    {employees.map((employee) => (
                      <option key={employee.employee_id} value={employee.id}>
                        {employee.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lương cơ bản</label>
                  <input
                    type="number"
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={newSalary.base_salary || 0}
                    onChange={(e) => setNewSalary({ ...newSalary, base_salary: parseInt(e.target.value) })}
                    required
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

      {
        openCaculate && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-white rounded-lg w-[700px]">
              <h2 className="mb-4 text-xl font-bold">Bảng lương sau thuế theo tháng</h2>
              <form onSubmit={handleAddMonthSalary}>
                <div className="flex flex-row items-start gap-5 space-y-4">
                  <div className="flex flex-col w-full mt-4">
                    <label className="block mt-2 text-sm font-medium text-gray-700">Tên nhân viên</label>
                    <input
                      type="text"
                      value={caculate.full_name}
                      onChange={(e) => setCaculate({ ...caculate, employee_id: e.target.value })}
                      className="w-full p-2 border rounded"
                      disabled={true}
                    />

                    <label className="block mt-2 text-sm font-medium text-gray-700">Tháng</label>
                    <select
                      value={caculate.month}
                      onChange={(e) => setCaculate({ ...caculate, month: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Chọn tháng</option>
                      {Array.from({ length: 12 }, (_, index) => {
                        const month = new Date(2020, index); // Use any year (2020) for Date object, as month is zero-indexed
                        return (
                          <option key={index + 1} value={index + 1}>
                            {month.toLocaleString("vi-VN", { month: "long" })} {/* Full month name in Vietnamese */}
                          </option>
                        );
                      })}
                    </select>


                    <label className="block mt-2 text-sm font-medium text-gray-700">Năm</label>
                    <input
                      type="number"
                      value={caculate.year ?? new Date().getFullYear()}
                      onChange={(e) => setCaculate({ ...caculate, year: e.target.value })}
                      className="w-full p-2 border rounded"
                      min="2020"
                      max={new Date().getFullYear()}
                      step="1"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="block mt-2 text-sm font-medium text-gray-700">Khoản giảm trừ</label>
                    <input
                      type="text"
                      value={formatToVND(caculate.deduction)}
                      onChange={(e) => setCaculate({ ...caculate, deduction: +e.target.value })}
                      className="w-full p-2 border rounded"
                      disabled={true}
                    />

                    <label className="block mt-2 text-sm font-medium text-gray-700">Thuế</label>
                    <input
                      type="text"
                      value={formatToVND(caculate.tax)}
                      onChange={(e) => setCaculate({ ...caculate, tax: +e.target.value })}
                      className="w-full p-2 border rounded"
                      disabled={true}
                    />

                    <label className="block mt-2 text-sm font-medium text-gray-700">Lương sau thuế</label>
                    <input
                      type="text"
                      value={formatToVND(caculate.total_salary)}
                      onChange={(e) => setCaculate({ ...caculate, total_salary: +e.target.value })}
                      className="w-full p-2 border rounded"
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    type="button"
                    onClick={() => setOpenCaculate(false)}
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
        )
      }
    </div>
  );
};

export default Salary;
