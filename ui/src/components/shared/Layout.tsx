import React from "react";

import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app flex flex-col justify-between">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
