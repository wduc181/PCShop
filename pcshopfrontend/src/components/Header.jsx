import React from "react";
import { Link } from "react-router";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-15 bg-black text-white flex items-center justify-end px-6 shadow-md z-50">
      <Link
        to="/"
        className="font-mono text-2xl font-bold tracking-widest">
        PCShop
      </Link>
    </header>
  );
};

export default Header;
