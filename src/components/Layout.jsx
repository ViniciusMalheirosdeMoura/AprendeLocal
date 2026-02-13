import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";


export default function Layout() {
  const location = useLocation();


  const hideHeaderPages = ["/entrar", "/cadastrar"];

  const hideHeader = hideHeaderPages.includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header userRole="student" />}

      <main className="flex-1 min-h-screen bg-gray-50">
        <Outlet />
      </main>

      
      <Footer />
    </>
  );
}