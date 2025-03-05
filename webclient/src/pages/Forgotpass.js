import React, { useCallback, useState, useEffect } from "react";
import student from "../assets/student.png"
import score from "../assets/score.png"
import homework from "../assets/homework.png"
import eke from "../assets/eke.png"
import book from "../assets/book.png"
import note from "../assets/note.png"
import bag from "../assets/bag.png"
import { useDispatch, useSelector } from "react-redux"
import { Backdrop, CircularProgress } from '@mui/material';
import * as actions from "../store/actions"
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import Swal from "sweetalert2";
import { useTitle } from 'react-use';
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { MdOutlineContactSupport } from "react-icons/md";
import { path } from "../ultils/containts";
import { useNavigate } from "react-router-dom";


const ForgotPass = function () {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigator = useNavigate()
  
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
        setErrors({ ...errors, email: "Invalid email format" });
      } else {
        setErrors({ ...errors, email: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!errors.email && formData.email) {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({ ...formData, email: suggestion });
    setSuggestions([]);
  };

  return (
    <div className="flex items-center">
      <div class="bg-cover bg-center h-screen w-full flex">
        <div className="md:block hidden w-2/3 min-h-screen object-cover relative bg-primary">
          <img src={score} alt="" className="sm:h-[200px] sm:w-[200px] absolute top-0 left-0 w-[100px] h-[100]px" />
          <img src={student} alt="" className="h-screen absolute right-0" />
          <span className="absolute left-2 bottom-2 text-gray-400 text-[11px] flex flex-col items-center justify-center">
            <p> Copyright © 2024.</p>
            <p>Developed by Black Team.</p>
          </span>
        </div>
        <section class="bg-gray-50 min-h-screen w-full flex items-center justify-center">
          <div class="bg-gray-100 flex rounded-2xl shadow-lg xl:max-w-3xl w-full mx-20 p-5 items-center">
            <div className="xl:w-2/3 w-full flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-2xl w-full p-8 transform transition-all duration-300 hover:scale-[1.02]">
                <h2 className="text-3xl font-bold text-center text-primary mb-8">Lấy lại mật khẩu</h2>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-primary mb-1"
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
                      <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg">
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || errors.email || errors.password}
                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 ${isLoading || errors.email || errors.password ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-95"}`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-2" /> Loading...
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
                  <p>Đã có tài khoản?</p>
                  <button class=" hover:bg-blue-600 hover:text-white py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
                  onClick={() => navigator(path.LOGIN)}
                  >Đăng nhập</button>
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


export default ForgotPass