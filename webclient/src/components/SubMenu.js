import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import User from "../assets/user.jpg"
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from "jwt-decode"
import * as actions from "../store/actions"
import { useNavigate } from 'react-router-dom';
import { path } from './../ultils/containts';
import { dropMenuItems } from "../ultils/items";

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const dropdownRef = useRef(null);
  const { token } = useSelector(state => state.auth)
  const type = token ? jwtDecode(token).type : 0
  const dispatch = useDispatch()
  const navigator = useNavigate();


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveSubmenu(null);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setActiveSubmenu(null);
    }
  };

  const handleSubmenuClick = (itemId) => {
    setActiveSubmenu(activeSubmenu === itemId ? null : itemId);
  };

  return (
    <div
      className="relative w-full bg-transparent cursor-pointer md:w-64"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <div
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center justify-between w-full px-4 py-3 text-gray-800 transition-all duration-300 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <img src={User} alt="" className={`w-[41px] h-[41px] rounded-full object-cover`} />
        <p className="text-primary cursor-pointer text-[13px] scale-x-0 w-0 sm:w-[57%] sm:scale-100 lg:text-[1rem]">{token ? jwtDecode(token).email : "No user"}</p>
        <FiChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div
          className="absolute z-50 w-full py-2 bg-white rounded-lg shadow-xl animate-slideDown"
          role="menu"
          aria-orientation="vertical"
        >
          {dropMenuItems(type).map((item) => (
            <div key={item.id}>
              <button
                className="flex items-center w-full px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600"
                role="menuitem"
                onClick={() => {
                  item.submenu && handleSubmenuClick(item.id);
                  switch (item.id) {
                    case 5:
                      dispatch(actions.logout())
                      navigator(path.LOGIN)
                      break;
                    default:
                      if (item.path) {
                        navigator(item.path);
                        setIsOpen(!isOpen);
                      }
                      break;
                  }
                }}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="flex-grow text-left">{item.label}</span>
                {item.submenu && (
                  <FiChevronRight
                    className={`w-4 h-4 transition-transform duration-200 ${activeSubmenu === item.id ? "transform rotate-90" : ""}`}
                  />
                )}
              </button>

              {item.submenu && activeSubmenu === item.id && (
                <div className="pl-4 bg-gray-50">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600"
                      rol="emenuitem"
                    >
                      <span className="mr-3">{subItem.icon}</span>
                      <span>{subItem.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;