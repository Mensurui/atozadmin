import React from "react";
import { useNavigate } from "@remix-run/react";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <ul>
        <li>
          <button onClick={() => navigate(`/home`)}>Home</button>
        </li>
        <li>
          <button onClick={() => navigate(`/products`)}>Products</button>
        </li>
        {/* Add more navigation items as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;
