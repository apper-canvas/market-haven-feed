import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import App from "@/App";

const Layout = () => {
  return (
    <App>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </App>
  );
};

export default Layout;