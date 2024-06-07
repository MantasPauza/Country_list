import React from "react";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return <h1 className={className}>Countries List</h1>;
};

export default Header;
