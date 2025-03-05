import React, { useCallback, useState, useEffect, act } from "react";
import student from "../assets/student.png"
import score from "../assets/score.png"
import homework from "../assets/homework.png"
import eke from "../assets/eke.png"
import book from "../assets/book.png"
import note from "../assets/note.png"
import bag from "../assets/bag.png"
import { useDispatch, useSelector } from "react-redux"
import * as actions from "../store/actions"
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { MdOutlineContactSupport } from "react-icons/md";
import { path } from "../ultils/containts";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = function () {
  const { isLoggedIn } = useSelector(state => state.auth)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigator = useNavigate()
  const dispatch = useDispatch()

  const emailDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      if (!value.includes("@")) {
        const newSuggestions = emailDomains.map((domain) => value + domain);
        setSuggestions(newSuggestions);
      } else {
        setSuggestions([]);
      }

      if (!validateEmail(value) && value) {
        setErrors({ ...errors, email: "Không đúng định dạng email" });
      } else {
        setErrors({ ...errors, email: "" });
      }
    }

    if (name === "password") {
      if (value.length < 8 && value) {
        setErrors({ ...errors, password: "Mật khẩu phải lớn hơn hoặc bằng 8 ký tự" });
      } else {
        setErrors({ ...errors, password: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!errors.email && !errors.password && formData.email && formData.password) {
      setIsLoading(true);
      // Simulate API call
      // console.log(formData)
      const response = await dispatch(actions.login(formData))
      console.log(response)
      if (response?.status === 200 && response?.data?.err === 0) {
        navigator('/main/home')
        dispatch(actions.state({ active: path.HOME, content: "Trang chủ" }))
      } else {
        toast.warn(response?.data?.msg)
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
    } else {
      if(!formData.email || !formData.password) {
        toast.warn('Không được bỏ trống thông tin!')
        return;
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({ ...formData, email: suggestion });
    setSuggestions([]);
  };

  useEffect(() => {
    if (isLoggedIn) navigator('/main/home')
  }, [])

  return (
    <div className="flex items-center">
      <ToastContainer />
      <div class="bg-cover bg-center h-screen w-full flex">
        <div className="relative hidden object-cover w-2/3 min-h-screen md:block bg-primary">
          <img src={score} alt="" className="sm:h-[200px] sm:w-[200px] absolute top-0 left-0 w-[100px] h-[100]px" />
          <img src={student} alt="" className="absolute right-0 h-screen" />
          <span className="absolute left-2 bottom-2 text-gray-400 text-[11px] flex flex-col items-center justify-center">
            <p> Copyright © 2024.</p>
            <p>Developed by Black Team.</p>
          </span>
        </div>
        <section class="bg-gray-50 min-h-screen w-full flex items-center justify-center">
          <div class="bg-gray-100 flex rounded-2xl shadow-lg xl:max-w-3xl w-full mx-20 p-5 items-center">
            <div className="flex items-center justify-center w-full p-4 xl:w-2/3">
              <div className="bg-white rounded-xl shadow-2xl w-full p-8 transform transition-all duration-300 hover:scale-[1.02]">
                <h2 className="mb-8 text-3xl font-bold text-center text-primary">Đăng nhập</h2>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="block mb-1 text-sm font-medium text-primary"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Nhập email của bạn"
                      autoComplete="email"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <p
                        id="email-error"
                        className="mt-1 text-sm text-red-500"
                        role="alert"
                      >
                        {errors.email}
                      </p>
                    )}
                    {suggestions.length > 0 && (
                      <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block mb-1 text-sm font-medium text-primary"
                    >
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Nhập mật khẩu của bạn"
                        autoComplete="current-password"
                        aria-invalid={errors.password ? "true" : "false"}
                        aria-describedby={errors.password ? "password-error" : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-primary focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && (
                      <p
                        id="password-error"
                        className="mt-1 text-sm text-red-500"
                        role="alert"
                      >
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || errors.email || errors.password}
                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 ${isLoading || errors.email || errors.password ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-95"}`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <FaSpinner className="mr-2 animate-spin" /> Loading...
                      </span>
                    ) : (
                      "Đăng nhập"
                    )}
                  </button>
                </form>
                <div class="mt-5 text-xs border-b border-[#002D74] py-4 text-[#002D74] flex items-center">
                  <a href="#" className="flex items-center">
                    <p>Trợ giúp</p>
                    <MdOutlineContactSupport className="ml-2" />
                  </a>
                </div>

                <div class="mt-3 text-xs flex justify-between items-center text-[#002D74]">
                  <p>Quên mật khẩu?</p>
                  <button class=" hover:bg-blue-600 hover:text-white py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
                    onClick={() => navigator(path.FORGOTPASS)}
                  >Lấy lại</button>
                </div>
              </div>
            </div>
            <div class="xl:block hidden xl:w-1/2 w-0 relative">
              <img class="rounded-2xl" src={homework} />
              <img src={eke} className="absolute w-[200px] h-[200px] top-0 left-2" />
              <img src={book} className="absolute w-[200px] h-[200px] top-[20%] -right-4" />
              <img src={note} className="absolute w-[200px] h-[200px] top-1/2 left-2" />
              <img src={bag} className="absolute w-[100px] h-[100px] bottom-3 right-2" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


export default Login