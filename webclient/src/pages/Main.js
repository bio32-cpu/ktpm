import React, { useEffect, useState } from "react";
import { BiChevronLeft } from "react-icons/bi"
import { Sidebar, Footer, UserProfile, Header } from "../components";
import { Outlet } from "react-router-dom";
import { MdOutlineClose } from "react-icons/md";
import { useSelector } from "react-redux"
import { Backdrop, CircularProgress } from '@mui/material';
import { path } from "../ultils/containts"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import notLoggin from '../assets/notLogin.svg'
import Home from './Home';
import useCheckLogin from "../hooks/useCheckLogin";

const Main = () => {
    let text = "";
    const [toggle, settoggle] = useState(false);
    const [content, setContent] = useState("Home")
    const [openMenu, setOpenMenu] = useState(false)
    const [change, setChange] = useState(false)
    const { isLoggedIn } = useSelector(state => state.auth)
    const { token } = useSelector(state => state.auth)
    const type = token ? jwtDecode(token).type : ""
    const email = token ? jwtDecode(token).email : ''
    //const name = token? jwtDecode(token).name : 'Admin'
    const navigate = useNavigate()
    //
    const getContent = (input) => {
        text = input;
        setContent(text)
    }
    //
    const changeValue = () => {
        setOpenMenu((prev) => prev = !prev);
    }

    useCheckLogin();

    return (
        <div className="w-full h-screen">
            {
                isLoggedIn && (
                    <div className="flex object-cover h-full">
                        <div className={`${toggle ? "w-[4.8rem]" : ""} sidebar fixed z-10 hidden lg:block`}>
                            <UserProfile toggle={toggle} />
                            <Sidebar toggle={toggle} getContent={getContent} type={type} />
                            <div className="absolute top-[7rem] flex items-center justify-center -right-5 w-10 h-10 bg-gray-300 rounded-full cursor-pointer hover:bg-white transition-all duration-300" onClick={() => { settoggle(!toggle) }}>
                                <BiChevronLeft className={`${toggle ? "rotate-180" : ""} text-3xl transition-all duration-100`} />
                            </div>
                        </div>
                        <div className={`${openMenu ? "left-0" : "-left-full"}  bg-primary h-[100%] w-[13rem] p-2 border transition-all duration-300 fixed z-50 -left-full top-0`}>
                            <UserProfile />
                            <Sidebar getContent={getContent} type={type} />
                            <div className="absolute top-[7rem] flex items-center justify-center -right-5 w-10 h-10 bg-gray-100 rounded-full cursor-pointer hover:bg-white transition-all duration-300" onClick={changeValue}>
                                <MdOutlineClose className={`${openMenu ? "rotate-180" : ""} text-3xl transition-all duration-100 text-primary`} />
                            </div>
                        </div>
                        <div className={`${toggle ? "w-[4.8rem]" : ""} sidebar bg-white z-0 hidden lg:block`}>

                        </div>
                        <div className={`w-full lg:w-[calc(100%-13rem)] ${toggle ? "transition-all duration-300  lg:w-[calc(100%-76.8px)] " : "transition-all lg:w-[calc(100%-13rem)] duration-300"}`}>
                            <div className={`fixed top-0 right-0 h-[50px] 2xl:rounded-r-xl bg-gray-100 w-full lg:w-[calc(100%-13rem)] z-40 ${toggle ? "transition-all duration-300 lg:w-[calc(100%-76.8px)]" : "transition-all duration-300 lg:lg:w-[calc(100%-13rem)]"}`}>
                                <Header content={content} getValue={changeValue} setChange={setChange} />
                            </div>
                            <div className="h-[50px] w-full z-50"></div>
                            <div className="z-0 w-full px-6 py-4 bg-gray-50">
                                <Outlet />
                            </div>
                            <div className="h-[80px] sm:h-[100px] md:h-[50px] w-full"></div>
                            <div className={`fixed right-0 h-[30px] xl:h-[35px] sm:h-[50px] 2xl:rounded-r-xl w-full lg:w-[calc(100%-13rem)] bottom-0 bg-gray-100 z-40 ${toggle ? "transition-all duration-300  lg:w-[calc(100%-76.8px)] " : "transition-all lg:w-[calc(100%-13rem)] duration-300 "}`}>
                                <Footer />
                            </div>
                        </div>
                    </div>
                )
            }
            {
                !isLoggedIn && (
                    <div className="flex flex-col items-center justify-center w-full min-h-screen">
                        <div className="w-[500px]">
                            <img className="h-[500px] w-[500px]" src={notLoggin} />
                        </div>
                        <p className="text-[25px]">Token Required</p>
                        <p className="text-[18px]">Please adjust your security preferences before continuing . . .</p>
                    </div>
                )
            }

        </div>
    )
}


export default Main