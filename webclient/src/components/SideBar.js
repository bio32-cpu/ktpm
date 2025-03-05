import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { IoIosLogOut } from "react-icons/io";
import { TbReportMoney } from "react-icons/tb";
import { ImProfile } from "react-icons/im";
import { MdFindInPage } from "react-icons/md";
import { FaCalculator } from "react-icons/fa";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { path } from "../ultils/containts";
import { FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";
import { jwtDecode } from 'jwt-decode';

const SideBar = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeItem, setActiveItem] = useState(""); // Trạng thái của mục đang được chọn

    const getContent = props.getContent;
    const toggle = props.toggle;

    const handleNavigation = (label, path) => {
        getContent(label);
        setActiveItem(path);
        navigate(path);
        handleStateUpdate({ active: path, content: label });
    };

    const { active } = useSelector(state => state.state);
    const { token } = useSelector(state => state.auth)
    const type = token ? jwtDecode(token)?.type : null
    const handleStateUpdate = (page) => {
        dispatch(actions.state(page));
    };

    useEffect(() => {
        setActiveItem(active);
        // console.log(type);
    }, [active]);

    return (
        <div className={`${toggle ? "" : ""} flex flex-col justify-between h-[90%]`}>
            <div className="">
                <div
                    onClick={() => handleNavigation("Home", path.HOME)}
                    className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData ${activeItem === path.HOME ? "text-black bg-white" : ""}`}
                >
                    <div className="mr-8 text-[1.7rem]"><RxDashboard /></div>
                    <div className={`${toggle ? "opacity-0 " : "transition-opacity "} text-[14px] whitespace-pre`}>Trang chủ</div>
                </div>
                <div
                    onClick={() => handleNavigation("Thông tin cá nhân", path.PROFILE)}
                    className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData ${activeItem === path.PROFILE ? "text-black bg-white" : ""}`}
                >
                    <div className="mr-8 text-[1.7rem]"><ImProfile /></div>
                    <div className={`${toggle ? "opacity-0 " : "transition-opacity "} text-[14px] whitespace-pre`}>Thông tin</div>
                </div>
                {
                    type !== 0 && (
                        <div
                            onClick={() => handleNavigation("Quản lý nhân viên", path.EMPLOYEE)}
                            className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData ${activeItem === path.EMPLOYEE ? "text-black bg-white" : ""}`}
                        >
                            <div className="mr-8 text-[1.7rem]"><FaUsers /></div>
                            <div className={`${toggle ? "opacity-0 " : "transition-opacity "} text-[14px] whitespace-pre`}>Nhân viên</div>
                        </div>
                    )
                }
                {
                    type === 2 && (
                        <div>
                            <div
                                onClick={() => handleNavigation("Quản lý phòng ban", path.DEPARTMENT)}
                                className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData ${activeItem === path.DEPARTMENT ? "text-black bg-white" : ""}`}
                            >
                                <div className="mr-8 text-[1.7rem]"><MdFindInPage /></div>
                                <div className={`${toggle ? "opacity-0 " : "transition-opacity "} text-[14px] whitespace-pre`}>Phòng ban</div>
                            </div>
                            <div
                                onClick={() => handleNavigation("Quản lý tài khoản", path.ACCOUNT)}
                                className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData ${activeItem === path.ACCOUNT ? "text-black bg-white" : ""}`}
                            >
                                <div className="mr-8 text-[1.7rem]"><RiAccountPinBoxFill /></div>
                                <div className={`${toggle ? "opacity-0 " : "transition-opacity "} text-[14px] whitespace-pre`}>Tài khoản</div>
                            </div>
                        </div>
                    )
                }
                {
                    type !== 0 && (
                        <div
                            onClick={() => handleNavigation("Quản lý bảng lương", path.SALARY)}
                            className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData ${activeItem === path.SALARY ? "text-black bg-white" : ""}`}
                        >
                            <div className="mr-8 text-[1.7rem]"><TbReportMoney /></div>
                            <div className={`${toggle ? "opacity-0 " : "transition-opacity "} text-[14px] whitespace-pre`}>Bảng lương</div>
                        </div>
                    )
                }
                <div
                    onClick={() => handleNavigation("Thông tin lương và thuế", path.TAX)}
                    className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData ${activeItem === path.TAX ? "text-black bg-white" : ""}`}
                >
                    <div className="mr-8 text-[1.7rem]"><FaCalculator /></div>
                    <div className={`${toggle ? "opacity-0 " : "transition-opacity "} text-[14px] whitespace-pre`}>Lương và thuế</div>
                </div>
            </div>

            <div>
                <div
                    onClick={() => {
                        dispatch(actions.logout());
                        dispatch(actions.state({ active: null, content: null }))
                    }}
                    className={`${toggle ? "w-[3.5rem]" : "w-[12rem]"} sideData ${activeItem === path.LOGIN ? "text-black bg-white" : ""}`}
                >
                    <div className="mr-8 text-[1.7rem]"><IoIosLogOut /></div>
                    <div className={`${toggle ? "opacity-0 " : "transition-opacity "} text-[14px] whitespace-pre`}>Đăng xuất</div>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
