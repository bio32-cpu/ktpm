import React, { useState, useEffect } from "react";
import { FaUser, FaCamera, FaExclamationCircle, FaEdit, FaUserCircle, FaPen } from "react-icons/fa";
import User from "../assets/user.jpg"
import { apiGetInfor, apiUpdateInfor } from "../services/employeeService";
import { useSelector } from "react-redux";
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './../components/Spinner';

const Profile = () => {

    const { token } = useSelector(state => state.auth)
    const employee_id = token ? jwtDecode(token).employee_id : "";
    
    const [isLoading, setIsLoading] = useState(true)
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        dob: "",
        phone_number: "",
        gender: "",
        address: "",
        department_name: "",
        dependent_number: "",
        socialLinks: {
            linkedin: "",
            twitter: "",
            github: ""
        }
    });

    const fetchData = async () => {
        try {
            const response = await apiGetInfor({ employee_id });
            if (response?.status === 200 && response?.data?.err === 0) {
                const data = response.data.data;

                setFormData({
                    id: data.id,
                    full_name: data.full_name,
                    email: data.account?.email || "",
                    dob: data.dob ? data.dob.split("T")[0] : "",
                    phone_number: data.phone_number || "",
                    gender: data.gender,
                    address: data.address || "",
                    department_name: data.department?.department_name || "",
                    dependent_number: data.dependent_number || "",
                    employee_id: employee_id,
                    socialLinks: {
                        linkedin: "",
                        twitter: "",
                        github: ""
                    }
                });
            } else {
                toast.warn(response?.data?.msg);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Lỗi khi tải dữ liệu.");
        }
        setIsLoading(false)
    };

    const updateData = async (data) => {
        setIsLoading(true)
        try {
            const response = await apiUpdateInfor(data);
            if (response?.status === 200 && response?.data?.err === 0) {

            } else {
                fetchData()
                toast.warn(response?.data?.msg);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Lỗi khi update dữ liệu.");
        }
        setIsLoading(false)
    };


    useEffect(() => {
        fetchData();
    }, [employee_id]);

    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                error = !emailRegex.test(value) ? "Không đúng định dạng email" : "";
                break;
            case "dob":
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                error = !dateRegex.test(value) ? "Sai định dạng ngày tháng (YYYY-MM-DD)" : "";
                break;
            case "phone_number":
                const phoneRegex = /^\d{10}$/;
                error = !phoneRegex.test(value) ? "Số điện thoại bao gồm 10 chữ số" : "";
                break;
            case "dependent_number":
                error = value < 0 ? "Số người phụ thuộc phải là số không âm" : "";
                break;
            default:
                error = !Number.isInteger(value) && value.trim() === "" ? "Không được bỏ trống thông tin" : "";
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleSocialLinkChange = (platform, value) => {
        setFormData((prev) => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [platform]: value
            }
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (key !== "socialLinks") {
                const error = validateField(key, formData[key]);
                if (error) newErrors[key] = error;
            }
        });
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log("Form submitted:", formData);
            // api
            updateData(formData);

            setIsEditing(false);
        } else {
            Object.values(newErrors).forEach((error) => {
                toast.error(error);
            });
        }
    };

    return (
        <div className="flex min-h-screen px-4 py-2 bg-gradient-to-br from-blue-50 to-indigo-50 sm:px-6 lg:px-8">
            <ToastContainer />
            <Spinner
                isOpen={isLoading}
                onClose={() => setIsLoading(false)}
                message="Loading....."
            />
            <div className="mx-auto overflow-hidden bg-white shadow-xl rounded-2xl min-w-[500px]">
                <div className="flex flex-col gap-10 px-6 py-10 xl:flex-row justify-beetwen">
                    <div className="xl:pt-4">
                        <div className="text-center flexmb-8">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Thông tin cá nhân</h1>
                            <p className="mt-2 text-gray-600 text-md">Quản lý và sửa đổi thông tin của bạn</p>
                        </div>

                        <div className="flex flex-col items-center mt-12 mb-12">
                            <div className="relative group">
                                <img
                                    src={User}
                                    alt="Profile"
                                    className="object-cover w-40 h-40 transition-transform duration-300 transform border-4 border-white rounded-full shadow-2xl hover:scale-105"
                                />
                                <label
                                    htmlFor="profile-image"
                                    className="absolute p-3 transition-all duration-200 bg-blue-600 rounded-full shadow-lg cursor-pointer bottom-2 right-2 hover:bg-blue-700 group-hover:scale-110"
                                >
                                    <FaCamera className="text-xl text-white" />
                                    <input
                                        type="file"
                                        id="profile-image"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        aria-label="Upload profile picture"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Personal Information */}
                            <div className="space-y-6">
                                <div className="p-6 bg-gray-50 rounded-xl">
                                    <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
                                        <FaUserCircle className="mr-2" /> Thông tin cá nhân
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                                                Họ và tên
                                            </label>
                                            <div className="relative mt-1">
                                                <input
                                                    type="text"
                                                    id="full_name"
                                                    name="full_name"
                                                    value={formData.full_name}
                                                    onChange={handleInputChange}
                                                    className={`block w-full px-4 py-3 rounded-lg border ${errors.full_name ? "border-red-500" : "border-gray-300"} focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                                                    disabled={!isEditing}
                                                />
                                                {errors.full_name && (
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <FaExclamationCircle className="text-red-500" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                                                Ngày sinh
                                            </label>
                                            <div className="relative mt-1">
                                                <input
                                                    type="date"
                                                    id="dob"
                                                    name="dob"
                                                    value={formData.dob}
                                                    onChange={handleInputChange}
                                                    className={`block w-full px-4 py-3 rounded-lg border ${errors.dob ? "border-red-500" : "border-gray-300"} focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                                Giới tính
                                            </label>
                                            <select
                                                id="gender"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                className="block w-full px-4 py-3 mt-1 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                disabled={!isEditing}
                                            >
                                                <option value="">Lựa chọn giới tính</option>
                                                <option value="0">Nam</option>
                                                <option value="1">Nữ</option>
                                                <option value="2">Khác</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="dependent_number" className="block text-sm font-medium text-gray-700">
                                                Số người phụ thuộc
                                            </label>
                                            <div className="relative mt-1">
                                                <input
                                                    type="text"
                                                    id="dependent_number"
                                                    name="dependent_number"
                                                    value={formData.dependent_number}
                                                    onChange={handleInputChange}
                                                    className={`block w-full px-4 py-3 rounded-lg border ${errors.dob ? "border-red-500" : "border-gray-300"} focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                                                    disabled={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-6">
                                <div className="p-6 bg-gray-50 rounded-xl">
                                    <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
                                        <FaUser className="mr-2" /> Thông tin liên hệ
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <div className="relative mt-1">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className={`block w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                                                    disabled={true}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                                                Số điện thoại
                                            </label>
                                            <div className="relative mt-1">
                                                <input
                                                    type="tel"
                                                    id="phone_number"
                                                    name="phone_number"
                                                    value={formData.phone_number}
                                                    onChange={handleInputChange}
                                                    className={`block w-full px-4 py-3 rounded-lg border ${errors.phone_number ? "border-red-500" : "border-gray-300"} focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                                Địa chỉ
                                            </label>
                                            <input
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                rows="3"
                                                className="block w-full px-4 py-3 mt-1 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                disabled={!isEditing}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="department_name" className="block text-sm font-medium text-gray-700">
                                                Phòng ban
                                            </label>
                                            <input
                                                id="department_name"
                                                name="department_name"
                                                value={formData?.department_name}
                                                onChange={handleInputChange}
                                                rows="3"
                                                className="block w-full px-4 py-3 mt-1 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="p-6 bg-gray-50 rounded-xl">
                            <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
                                <FaPen className="mr-2" /> Liên kết mạng xã hội
                            </h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div>
                                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                                        LinkedIn
                                    </label>
                                    <input
                                        type="url"
                                        id="linkedin"
                                        value={formData.socialLinks.linkedin}
                                        onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                                        className="block w-full px-4 py-3 mt-1 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="https://linkedin.com/in/username"
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                                        Twitter
                                    </label>
                                    <input
                                        type="url"
                                        id="twitter"
                                        value={formData.socialLinks.twitter}
                                        onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                                        className="block w-full px-4 py-3 mt-1 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="https://twitter.com/username"
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                                        GitHub
                                    </label>
                                    <input
                                        type="url"
                                        id="github"
                                        value={formData.socialLinks.github}
                                        onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                                        className="block w-full px-4 py-3 mt-1 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="https://github.com/username"
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-6 py-3 text-white transition-colors duration-200 bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                {isEditing ? "Đóng" : "Sửa"}
                            </button>
                            {isEditing && (
                                <button
                                    type="submit"
                                    className="px-6 py-3 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Lưu
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;