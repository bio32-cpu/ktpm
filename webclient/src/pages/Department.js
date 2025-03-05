import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiPlusCircle } from "react-icons/fi";
import { FaSort } from "react-icons/fa";
import * as apiService from "../services";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from "../components/Spinner";
import { confirmFunction } from "../ultils/confirmFunction";
import { handleCheckError } from "../ultils/checkFunction";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [paginatedDepartments, setPaginatedDepartments] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const [isLoading, setIsLoading] = useState(true)
  const [newDepartment, setNewDepartment] = useState({
    department_name: "",
  });


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiService.apiAllDepartment();
      if (response?.status === 200 && response?.data?.err === 0) {
        setDepartments(response?.data?.data);
      } else {
        toast.warn(response?.data?.msg);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Lỗi khi tải dữ liệu.");
    }
    setIsLoading(false)
  };

  useEffect(() => {
    const filtered = departments
      .filter((department) =>
        department.department_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });

    setFilteredDepartments(filtered);

    const paginated = filtered.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    setPaginatedDepartments(paginated);

    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [departments, searchTerm, sortConfig, currentPage]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  // thêm mưới
  const handleAdd = (e) => {
    e.preventDefault();
    if (handleCheckError(newDepartment)) return;
    handleCreateApi(newDepartment);
  };

  const handleCreateApi = async (payload) => {
    setIsLoading(true)
    try {
      const response = await apiService.apiCreateDepartment(payload);
      if (response?.status === 200 && response?.data?.err === 0) {
        setShowAddModal(false);
        await fetchData();
        setNewDepartment({
          department_name: "",
        });
      } else {
        toast.warn(response?.data?.msg);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Lỗi khi tạo phòng ban.");
    }
    setIsLoading(false)
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (handleCheckError(editingDepartment)) return;
    handleUpdateApi(editingDepartment)
  };

  const handleUpdateApi = async (payload) => {
    setIsLoading(true)
    try {
      const response = await apiService.apiUpdateDepartment(payload);
      if (response?.status === 200 && response?.data?.err === 0) {
        await fetchData();
        setShowModal(false);
        setEditingDepartment(null);
      } else {
        toast.warn(response?.data?.msg);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Lỗi khi cập nhật dữ liệu.");
    }
    setIsLoading(false)
  };

  const handleDelete = async (id) => {
    await confirmFunction(() => {handleDeleteApi({ id })})
  };

  const handleDeleteApi = async (payload) => {
    setIsLoading(true)
    try {
      const response = await apiService.apiDeleteDepartment(payload);
      if (response?.status === 200 && response?.data?.err === 0) {
        await fetchData();
      } else {
        toast.warn(response?.data?.msg);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Lỗi khi xóa bản ghi.");
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
                { label: "Tên phòng ban", key: "department_name" },
                { label: "Thời gian tạo", key: "createdAt" },
                { label: "Thời gian sửa đổi", key: "updatedAt" }
              ].map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
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
            {paginatedDepartments.map((department) => (
              <tr key={department.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{department.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{department.department_name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{department.createdAt}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{department.updatedAt}</td>
                <td className="px-6 py-4 space-x-4 text-sm font-medium whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(department)}
                    className="text-blue-600 hover:text-blue-900"
                    aria-label="Edit department"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(department.id)}
                    className="text-red-600 hover:text-red-900"
                    aria-label="Delete department"
                  >
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
          Hiển thị trang {((currentPage - 1) * itemsPerPage) + 1} với {Math.min(currentPage * itemsPerPage, filteredDepartments.length)} / {filteredDepartments.length} kết quả
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

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg w-96">
            <h2 className="mb-4 text-xl font-bold">Sửa thông tin</h2>
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên phòng ban</label>
                  <input
                    type="text"
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={editingDepartment?.department_name || ""}
                    onChange={(e) =>
                      setEditingDepartment({
                        ...editingDepartment,
                        department_name: e.target.value,
                      })
                    }
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg w-96">
            <h2 className="mb-4 text-xl font-bold">Thêm mới</h2>
            <form onSubmit={handleAdd}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên phòng ban</label>
                  <input
                    type="text"
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={newDepartment.department_name}
                    onChange={(e) =>
                      setNewDepartment({ ...newDepartment, department_name: e.target.value })
                    }
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
    </div>
  );
};

export default Department;
