import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="page-wrapper">
      <Navbar /> {/* 🔼 Always on top */}
      <main className="main-content">
        <Outlet /> {/* 🔄 Page content changes here */}
      </main>
    </div>
  );
}
