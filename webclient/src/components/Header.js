import React from "react";
import { IoMdMenu } from "react-icons/io";
import logo from "../assets/logo.png"
import { useSelector } from "react-redux"
import { SubMenu } from ".";

const Header = (props) => {
    const { content } = useSelector(state => state.state)
    const getValue = props.getValue;
    // const type = jwtDecode(token).type

    const conTrolMenu = () => {
        getValue();
    }

    return (
        <div className="flex items-center justify-start h-full pl-6 md:justify-between z-100">
            <div className="flex items-center text-primary md:min-w-[0] min-w-[30%]">
                <div className="lg:hidden">
                    <div className="flex items-center justify-start">
                        <IoMdMenu className="text-[2rem] xl:text-[2rem] cursor-pointer" onClick={conTrolMenu} />
                        <p className="ml-2 text-[12px] lg:text-[1rem]">{content}</p>
                    </div>
                </div>
                <div className="hidden lg:flex">
                    <div className="flex items-center">
                        <IoMdMenu className="text-[1rem] xl:text-[2rem]" />
                        <p className="ml-2 text-[12px] lg:text-[1rem]">{content}</p>
                    </div>
                </div>
            </div>
            <div className="p-4 w-[250px]">
                <img src={logo} alt="" className="w-full h-full" />
            </div>
            <SubMenu />
        </div>

    );
}


export default Header