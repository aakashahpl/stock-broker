import React, { useState, useRef, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";

const ProfileDropdown: React.FC<{ handleLogout: () => void }> = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="px-4 relative" ref={dropdownRef}>
      {/* Dropdown trigger */}
      <button 
        onClick={toggleDropdown}
        className="flex items-center justify-center focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <CgProfile size={25} />
      </button>

      {/* Dropdown content */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Label */}
          <div className="px-4 py-2 text-sm font-medium text-gray-900">
            My Account
          </div>
          
          {/* Separator */}
          <div className="h-px bg-gray-200 my-1"></div>
          
          {/* Menu items */}
          <button
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            role="menuitem"
            onClick={() => {
              // Handle profile click
              setIsOpen(false);
            }}
          >
            Profile
          </button>
          
          <Link 
            href="/user/investments"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Investments
          </Link>
          
          <Link 
            href="/user/order"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Orders
          </Link>
          
          <button
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            role="menuitem"
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;