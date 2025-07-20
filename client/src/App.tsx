import { Outlet } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingThemeToggle from "./components/ThemeToggle";
// import AuthRedirect from "./context/AuthRedirect";

export default function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300 flex flex-col">
        <Header />
        <main className="flex-grow min-h-[calc(100vh-128px)]">
          <Outlet />
        </main>
        <Footer />
      </div>
      <FloatingThemeToggle />
      {/* <AuthRedirect /> */}
    </>
  );
}
