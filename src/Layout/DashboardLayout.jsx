import React from "react";
import { FaClipboardList, FaHome, FaStar, FaUserCircle } from "react-icons/fa";
import { NavLink, Outlet } from "react-router";
import Logo from "../Components/Logo/Logo";

const DashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open max-w-10/12 mx-auto">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 font-semibold">Dashboard</div>
        </div>

        <Outlet></Outlet>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu gap-2 bg-base-300 text-base-content min-h-full w-80 p-4">
          <Logo></Logo>

          <li>
            <NavLink to={`/`}>
              <FaHome className="inline mr-2" /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to={`myProfile`}>
              <FaUserCircle className="inline mr-2" /> My Profile
            </NavLink>
          </li>
          <li>
            <NavLink to={`myApplication`}>
              <FaClipboardList className="inline mr-2" /> My Application
            </NavLink>
          </li>
          <li>
            <NavLink to={`myReviews`}>
              <FaStar className="inline mr-2" /> My Reviews
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default DashboardLayout;