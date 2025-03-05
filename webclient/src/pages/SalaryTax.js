import React, { useState, useEffect } from "react";
import { FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiPlusCircle } from "react-icons/fi";
import { FaSort } from "react-icons/fa";
import * as apiService from "../services";
import { handleCheckError } from "../ultils/checkFunction";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './../components/Spinner';
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { confirmFunction } from "../ultils/confirmFunction";
import { CiCalculator1 } from "react-icons/ci";
import { months } from "../ultils/items";

const SalaryTax = () => {
  const [salarytaxes, setSalarytaxes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [filteredSalarytaxes, setFilteredSalarytaxes] = useState([]);
  const [paginatedSalarytaxes, setPaginatedSalarytaxes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 5;
  const [isLoading, setIsLoading] = useState(true);
  const [openCaculateTax, setOpenCaculateTax] = useState(false);
  const [openCaculateTaxByYear, setOpenCaculateTaxByYear] = useState(false);
  const [openResultCaculateTax, setOpenResultCaculateTax] = useState(false)
  const { token } = useSelector(state => state.auth)
  const type = token ? jwtDecode(token).type : null;
  const employee_id = token ? jwtDecode(token).employee_id : null
  // console.log(employee_id)
  const [yearTarget, setYearTarget] = useState(new Date().getFullYear().toString());
  const [monthTarget, setMonthTarget] = useState('');

  const [inputCaculate, setInputCaculate] = useState({
    salary: 0,
    depentdent_number: 0,
    total: 0,
    tax: 0,
    deduction: 0,
  })

  const [inputCaculateByYear, setInputCaculateByYear] = useState({
    total_salary: 0,
    total_deduction: 0,
    total_tax_month: 0,
    tax_year: 0,
    bol: true,
    result: 0,
  })

  useEffect(() => {
    fetchData();
  }, [yearTarget, monthTarget]);

  const fetchData = async () => {
    try {
      const salarytaxResponse = await apiService.apiAllMonthSalaries(type !== 2 ? { employee_id: employee_id, month: monthTarget, year: yearTarget } : { month: monthTarget, year: yearTarget })

      if (salarytaxResponse?.status === 200 && salarytaxResponse?.data?.err === 0) {
        setSalarytaxes(salarytaxResponse.data.data);
        // console.log(salarytaxResponse.data.data)
      } else {
        toast.warn("Không thể tải dữ liệu.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Lỗi khi tải dữ liệu.");
    }
    setIsLoading(false);
  };


  const geSalaryOfEmployee = async (id) => {
    try {
      const salarytaxResponse = await apiService.apiSalaryByEmployee({ employee_id: id })

      if (salarytaxResponse?.status === 200 && salarytaxResponse?.data?.err === 0) {
        return salarytaxResponse.data.data;
      } else {
        toast.warn("Có lỗi xảy ra. Vui lòng thử lại sau!");
        return;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
    }
  };


  useEffect(() => {
    const filtered = salarytaxes
      .filter(salarytax =>
        salarytax.employee?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });

    setFilteredSalarytaxes(filtered);

    const paginated = filtered.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    setPaginatedSalarytaxes(paginated);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [salarytaxes, searchTerm, sortConfig, currentPage]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const handleDelete = async (id) => {
    await confirmFunction(() => { handleDeleteApi(id) })
  };

  const handleDeleteApi = async (id) => {
    setIsLoading(true);
    try {
      const response = await apiService.apiDeleteSalaryTax({ id });
      if (response?.status === 200 && response?.data?.err === 0) {
        await fetchData();
      } else {
        toast.warn(response?.data?.msg);
      }
    } catch (error) {
      console.error("Error deleting salary tax data:", error);
      toast.error("Lỗi khi xóa dữ liệu thuế lương.");
    }
    setIsLoading(false);
  }

  function formatToVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  //thử tính thuế
  const handleTryCaculateTax = () => {
    const result = apiService.getSalaryTax(inputCaculate.salary, inputCaculate.depentdent_number);
    setInputCaculate({ ...inputCaculate, deduction: result.deduction, total: result.total_salary, tax: result.tax })
    setOpenResultCaculateTax(true);
  }

  // quyết toán 
  const handleTryCaculateTaxOfYear = async (employee_id) => {
    try {
      setIsLoading(true)
      const filldata = handleQT(); // Tạo dữ liệu ban đầu
      const salaryRes = await geSalaryOfEmployee(employee_id)
      console.log(salaryRes)
      const data = type !== 2 ?
        handleFillTaxOfYear(filldata, salarytaxes, salaryRes?.base_salary, salaryRes?.employee.dependent_number) :
        handleFillTaxOfYear(filldata, salarytaxes.filter((val) => val.employee_id === employee_id), salaryRes?.base_salary, salaryRes?.employee.dependent_number);
      const rs = apiService.getSalaryTaxOfYear(data);
      console.log(data, rs);

      setInputCaculateByYear({
        total_salary: rs.total_salary,
        total_deduction: rs.total_deduction,
        total_tax_month: rs.total_tax_month,
        tax_year: rs.tax_year,
        bol: rs.bol,
        result: rs.result,
      })

    } catch (error) {
      console.log(error)
      toast.warn("Có lỗi xảy ra. Vui lòng thử lại sau!!")
    } finally {
      setIsLoading(false);
      setOpenCaculateTaxByYear(prev => !prev);
    }
    // console.log(filtered);
  }

  // quyết toán thuế
  const handleFillTaxOfYear = (filldata, data, salary, dependent_number) => {
    console.log(data)
    // Cập nhật thông tin thuế cho các tháng có dữ liệu
    data.forEach(item => {
      const monthIndex = filldata.findIndex((obj) => obj.month === item.month);
      if (monthIndex !== -1) {
        filldata[monthIndex] = {
          month: item.month,
          salary: item?.salary,
          deduction: item?.deduction,
          tax: item?.tax
        };
      }
    });

    const caculate = apiService.getSalaryTax(salary, dependent_number);
    // Thêm các tháng chưa có dữ liệu vào mảng
    filldata.forEach((item) => {
      if (item.deduction === '') {
        item.salary = caculate.salary;
        item.deduction = caculate.deduction;
        item.tax = caculate.tax;
      }
    });

    return filldata;
  }

  const handleQT = () => {
    const array = [];
    for (let i = 1; i <= 12; i++) {
      array.push(
        {
          month: `${i}`,
          salary: "", deduction: "",
          tax: ''
        }
      );
    }
    return array;
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
        <div className="flex flex-row items-center justify-center gap-5">
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
          <div className="h-full">
            <select
              id="month"
              name="month"
              value={monthTarget}
              onChange={(e) => { setMonthTarget(e.target.value || ''); setIsLoading(true) }}
              className="flex text-gray-600 justify-center items-center h-[41px] px-5 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Chọn tháng</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          <div className="h-full">
            <select
              id="year"
              name="year"
              value={yearTarget}
              onChange={(e) => { setYearTarget(e.target.value); setIsLoading(true) }}
              className="flex text-gray-600 justify-center items-center h-[41px] px-5 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {['2024', '2025', '2026', '2027'].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-row gap-5">
          <button
            onClick={() => { setOpenCaculateTax(prev => !prev) }}
            className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <FiPlusCircle />
            <span>Thử tính thuế</span>
          </button>
          {
            type !== 2 ? (<button
              onClick={() => { handleTryCaculateTaxOfYear(employee_id) }}
              className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <FiPlusCircle />
              <span>Quyết toán</span>
            </button>) : (<></>)
          }
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {[
                { label: "Họ và tên", key: "employee.full_name" },
                { label: "Phòng ban", key: "employee.department.department_name" },
                { label: "Tháng", key: "month" },
                { label: "Năm", key: "year" },
                { label: "Lương", key: "employee.salaries[0].base_salary" },
                { label: "Khấu trừ", key: "deduction" },
                { label: "Lương nhận", key: "total_salary" },
                { label: "Thuế", key: "tax" }
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
            {paginatedSalarytaxes.map((salary) => (
              <tr key={salary.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{salary.employee.full_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{salary.employee.department.department_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{salary.month}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{salary.year}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatToVND(salary?.salary)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{formatToVND(salary.deduction)}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{formatToVND(salary.total_salary)}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{formatToVND(salary.tax)}</td>
                <td className="flex justify-center px-6 py-4 space-x-4 text-sm font-medium whitespace-nowrap">
                  {
                    type === 2 ? (<button onClick={() => handleTryCaculateTaxOfYear(salary.employee_id)} className="text-green-600 hover:text-green-900" aria-label="Delete salary">
                      <CiCalculator1 className="w-5 h-5" />
                    </button>) : (<></>)
                  }
                  <button onClick={() => handleDelete(salary.id)} className="text-red-600 hover:text-red-900" aria-label="Delete salary">
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
          Hiển thị trang {((currentPage - 1) * itemsPerPage) + 1} với {Math.min(currentPage * itemsPerPage, filteredSalarytaxes.length)} / {filteredSalarytaxes.length} kết quả
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

      {openCaculateTax && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg w-[700px]">
            <h2 className="mb-4 text-xl font-bold">Tính thuế thu nhập cá nhân</h2>
            <form onSubmit={() => { }}>
              <div className="flex flex-row items-start gap-5 space-y-4">
                <div className="flex flex-col w-full mt-4">
                  <label className="block mt-2 text-sm font-medium text-gray-700">Lương cơ bản</label>
                  <input
                    type="text"
                    value={inputCaculate.salary}
                    onChange={(e) => setInputCaculate({ ...inputCaculate, salary: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label className="block mt-2 text-sm font-medium text-gray-700">Số người phụ thuộc</label>
                  <input
                    type="number"
                    min="0"
                    value={inputCaculate.depentdent_number}
                    onChange={(e) => setInputCaculate({
                      ...inputCaculate,
                      depentdent_number: parseInt(e.target.value) // Đảm bảo không lưu giá trị NaN
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              {
                openResultCaculateTax && (
                  <div className="flex flex-row items-start gap-5 space-y-4">
                    <div className="flex flex-col w-full mt-4">
                      <label className="block mt-2 text-sm font-medium text-gray-700">Lương cơ bản</label>
                      <input
                        type="text"
                        value={formatToVND(inputCaculate.salary)}
                        className="w-full p-2 border rounded"
                        disabled={true}
                      />

                      <label className="block mt-2 text-sm font-medium text-gray-700">Khoản giảm trừ</label>
                      <input
                        type="text"
                        value={formatToVND(inputCaculate.deduction)}
                        className="w-full p-2 border rounded"
                        disabled={true}
                      />
                    </div>

                    <div className="flex flex-col w-full">
                      <label className="block mt-2 text-sm font-medium text-gray-700">Thuế phải nộp</label>
                      <input
                        type="text"
                        value={formatToVND(inputCaculate.tax)}
                        className="w-full p-2 border rounded"
                        disabled={true}
                      />

                      <label className="block mt-2 text-sm font-medium text-gray-700">Lương thực nhận</label>
                      <input
                        type="text"
                        value={formatToVND(inputCaculate.total)}
                        className="w-full p-2 border rounded"
                        disabled={true}
                      />
                    </div>
                  </div>
                )
              }
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpenCaculateTax(false);
                    setOpenResultCaculateTax(false)
                    setInputCaculate({
                      salary: 0,
                      depentdent_number: 0,
                      total: 0,
                      tax: 0,
                      deduction: 0,
                    })
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-white rounded-md ${openResultCaculateTax ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                  onClick={handleTryCaculateTax}
                  disabled={openResultCaculateTax}
                  aria-disabled={openResultCaculateTax}
                >
                  Tính thuế
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openCaculateTaxByYear && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg w-[700px]">
            <h2 className="mb-4 text-xl font-bold">Ước tính quyết toán thuế cuối năm</h2>
            <form onSubmit={() => { }}>
              <div className="flex flex-row items-start gap-5 space-y-4">
                <div className="flex flex-col w-full mt-4">
                  <label className="block mt-2 text-sm font-medium text-gray-700">Tổng lương cả năm</label>
                  <input
                    type="text"
                    value={formatToVND(inputCaculateByYear.total_salary)}
                    // onChange={(e) => setInputCaculate({ ...inputCaculate, salary: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="flex flex-col w-full mt-4">
                  <label className="block mt-2 text-sm font-medium text-gray-700">Tổng các khoản giảm trừ</label>
                  <input
                    type="text"
                    value={formatToVND(inputCaculateByYear.total_deduction)}
                    // onChange={(e) => setInputCaculate({ ...inputCaculate, salary: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex flex-row items-start gap-5 space-y-4">
                <div className="flex flex-col w-full mt-4">
                  <label className="block mt-2 text-sm font-medium text-gray-700">Thu nhập chịu thuế theo năm</label>
                  <input
                    type="text"
                    value={formatToVND(apiService.customRound(inputCaculateByYear.total_salary - inputCaculateByYear.total_deduction))}
                    // onChange={(e) => setInputCaculate({ ...inputCaculate, salary: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex flex-row items-start gap-5 space-y-4">
                <div className="flex flex-col w-full mt-4">
                  <label className="block mt-2 text-sm font-medium text-gray-700">Thuế theo thu nhập cả năm</label>
                  <input
                    type="text"
                    value={formatToVND(inputCaculateByYear.tax_year)}
                    // onChange={(e) => setInputCaculate({ ...inputCaculate, salary: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="flex flex-col w-full mt-4">
                  <label className="block mt-2 text-sm font-medium text-gray-700">Tổng thuế thu nhập của các tháng</label>
                  <input
                    type="text"
                    value={formatToVND(inputCaculateByYear.total_tax_month)}
                    // onChange={(e) => setInputCaculate({ ...inputCaculate, salary: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <div className="flex flex-row items-start gap-5 space-y-4">
                  <div className="flex flex-col w-full mt-4">
                    <label className="block mt-2 text-sm font-medium text-gray-700">{inputCaculateByYear?.bol ? "Truy thu" : "Truy nhận"}</label>
                    <input
                      type="text"
                      value={formatToVND(inputCaculateByYear.result)}
                      // onChange={(e) => setInputCaculate({ ...inputCaculate, salary: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpenCaculateTaxByYear(false);
                    // setOpenResultCaculateTax(false)
                    setInputCaculateByYear({
                      total_salary: 0,
                      total_deduction: 0,
                      total_tax_month: 0,
                      tax_year: 0,
                      bol: true,
                      result: 0,
                    })
                  }}
                  className="px-4 py-2 text-white bg-blue-600 border rounded-md hover:bg-blue-700"
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SalaryTax;
