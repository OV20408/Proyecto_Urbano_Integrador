// src/components/Navbar.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [bgColor, setBgColor] = useState("#f09e47");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () =>
      setBgColor(window.scrollY > 80 ? "#ff9900" : "#f09e47");
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 transition-colors duration-700 shadow-lg"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-5 md:py-6 text-white">
        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-bold tracking-wider hover:opacity-90 transition">
          PAUP
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {/* Menu Links */}
          <ul className="flex gap-8 text-[15px] font-semibold">
            <li>
              <Link to="/" className="hover:opacity-80 cursor-pointer transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/project" className="hover:opacity-80 cursor-pointer transition">
                Project
              </Link>
            </li>
            <li>
              <Link to="/ods11" className="hover:opacity-80 cursor-pointer transition">
                ODS 11
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:opacity-80 cursor-pointer transition">
                Contact
              </Link>
            </li>
          </ul>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3 ml-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 text-sm font-semibold border-2 border-white rounded-full hover:bg-white hover:text-[#f39a2e] transition-all duration-300"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 text-sm font-semibold bg-white text-[#f39a2e] rounded-full hover:bg-opacity-90 hover:shadow-lg transition-all duration-300"
            >
              Register
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;