import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiPlusCircle } from "react-icons/fi";
import { FaSort } from "react-icons/fa";
import * as apiService from "../services";
import { handleCheckError } from "../ultils/checkFunction"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './../components/Spinner';
import { confirmFunction } from "../ultils/confirmFunction";

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [paginatedAccounts, setPaginatedAccounts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 5;
  const [editingAccount, setEditingAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true)
  const [newAccount, setNewAccount] = useState({
    email: "",
    employee_id: 0,
    type: 0,
    pass_word: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accountResponse, employeeResponse] = await Promise.all([
        apiService.apiAllAccounts(),
        apiService.apiAllWhithoutAccount()
      ]);

      if (
        accountResponse?.status === 200 &&
        accountResponse?.data?.err === 0 &&
        employeeResponse?.status === 200 &&
        employeeResponse?.data?.err === 0
      ) {
        setAccounts(accountResponse.data.data);
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
    const filtered = accounts
      .filter(account =>
        account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.employee?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });

    setFilteredAccounts(filtered);

    const paginated = filtered.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    setPaginatedAccounts(paginated);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [accounts, searchTerm, sortConfig, currentPage]);

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
    handleCreateApi(newAccount)
  };

  const handleCreateApi = async (payload) => {
    setIsLoading(true)
    if (handleCheckError(newAccount)) {
      return;
    }
    try {
      const response = await apiService.apiCreateAccount(payload);
      if (response?.status === 200 && response?.data?.err === 0) {
        await fetchData();
        setShowAddModal(false);
        setNewAccount({
          email: "",
          employee_id: "",
          type: 0,
          pass_word: "",
        });
      } else {
        toast.warn(response?.data?.msg);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Lỗi khi tạo tài khoản liệu.");
    }
    setIsLoading(false)
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log(editingAccount)
    if (handleCheckError(editingAccount)) {
      return;
    }
    setIsLoading(true)
    try {
      const response = await apiService.apiUpdateAccount(editingAccount);
      if (response?.status === 200 && response?.data?.err === 0) {
        await fetchData();
        setShowModal(false);
        setEditingAccount(null);
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
    await confirmFunction(() => {handleDeleteApi(id)})
  };

  const handleDeleteApi = async (id) => {
    setIsLoading(true)
    try {
      const response = await apiService.apiDeleteAccount({ id });
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
            placeholder="Tìm kiếm theo email..."
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
                { label: "ID", key: "id" },
                { label: "Email", key: "email" },
                { label: "Loại tài khoản", key: "type" },
                { label: "Họ và tên", key: "employee.full_name" }
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
            {paginatedAccounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{account.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{account.email}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{account.type === 0 ? "Nhân viên" : account.type === 1 ? "Quản lý" : "Kế toán"}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{account.employee.full_name}</td>
                <td className="px-6 py-4 space-x-4 text-sm font-medium whitespace-nowrap">
                  <button onClick={() => handleEdit(account)} className="text-blue-600 hover:text-blue-900" aria-label="Edit account">
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(account.id)} className="text-red-600 hover:text-red-900" aria-label="Delete account">
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Hiển thị trang {((currentPage - 1) * itemsPerPage) + 1} với {Math.min(currentPage * itemsPerPage, filteredAccounts.length)} / {filteredAccounts.length} kết quả
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md cursor-auto disabled:opacity-50"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md cursor-auto disabled:opacity-50"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg w-96">
            <h2 className="mb-4 text-xl font-bold">Sửa thông tin</h2>
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="block w-full p-2 mt-1 bg-gray-200 border border-gray-300 rounded-md shadow-sm"
                    value={editingAccount.email}
                    onChange={(e) => setEditingAccount({ ...editingAccount, email: e.target.value })}
                    disabled={true}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                  <input
                    type="password"
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={editingAccount.pass_word || ""}
                    onChange={(e) => setEditingAccount({ ...editingAccount, pass_word: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                  <input
                    type="text"
                    className="block w-full p-2 mt-1 bg-gray-200 border border-gray-300 rounded-md shadow-sm"
                    value={editingAccount.employee.full_name}
                    onChange={(e) => setEditingAccount({ ...editingAccount, employee: { full_name: e.target.value } })}
                    disabled={true}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loại tài khoản</label>
                  <select
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={editingAccount.type}
                    onChange={(e) => setEditingAccount({ ...editingAccount, type: parseInt(e.target.value) })}
                    required
                  >
                    <option value={0}>Nhân viên</option>
                    <option value={1}>Quản lý</option>
                    <option value={2}>Kế toán</option>
                  </select>
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
          <div className="p-6 bg-white rounded-lg w-96">
            <h2 className="mb-4 text-xl font-bold">Tạo tài khoản</h2>
            <form onSubmit={handleAdd}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={newAccount.email}
                    onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                  <input
                    type="password"
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={newAccount.pass_word || ""}
                    onChange={(e) => setNewAccount({ ...newAccount, pass_word: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nhân viên</label>
                  <select
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={newAccount.employee_id || ""}
                    onChange={(e) => {
                      console.log(e.target.value)
                      setNewAccount({
                        ...newAccount,
                        employee_id: e.target.value,
                      });
                    }}
                    required
                  >
                    <option value="">Nhân viên chưa có tài khoản</option>
                    {employees.map((employee) => (
                      <option key={employee.employee_id} value={employee.id}>
                        {employee.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loại tài khoản</label>
                  <select
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={newAccount.type}
                    onChange={(e) => setNewAccount({ ...newAccount, type: parseInt(e.target.value) })}
                    required
                  >
                    <option value={0}>Nhân viên</option>
                    <option value={1}>Quản lý</option>
                    <option value={2}>Kế toán</option>
                  </select>
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

export default Account;
