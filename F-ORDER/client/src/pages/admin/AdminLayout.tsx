import { Fragment, useState } from "react";
import { Outlet } from "react-router-dom";
import HeadingAdmin from "../../components/admin/HeadingAdmin";
import NavAdmin from "../../components/admin/NavAdmin";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Fragment>
      <div className="fixed top-0 left-0 w-full z-50 bg-white ">
        <HeadingAdmin isOpen={isOpen} handleToggleNavbar={handleToggleNavbar} />
      </div>

      <div className="flex">
        <div
          className={`fixed left-0 top-[60px] h-[calc(100vh-60px)] bg-white shadow-md transition-all duration-200 ease-in-out ${
            isOpen ? "w-[20%]" : "w-[6%]"
          }`}
        >
          <NavAdmin isOpen={isOpen} />
        </div>
        <div
          className={`ml-auto transition-all duration-300 h-full mt-[60px] flex justify-center items-center   ${
            isOpen ? "w-[80%] ml-[20%]" : "w-[94%] ml-[6%]"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};

export default AdminLayout;
