import React from "react";
import { Link } from "react-router";
import SearchBar from "@/components/common/SearchBar";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-[60px] bg-black text-white flex items-center pl-6 pr-10 shadow-md z-50">
      <div className="w-full grid grid-cols-3 items-center gap-4">
        <div className="justify-self-start" />

        <div className="justify-self-center w-full max-w-xl">
          <SearchBar className="w-full" />
        </div>

        <Link
          to="/"
          className="justify-self-end font-mono text-2xl font-bold tracking-widest"
        >
          PCShop
        </Link>
        
      </div>
    </header>
  );
};

export default Header;
