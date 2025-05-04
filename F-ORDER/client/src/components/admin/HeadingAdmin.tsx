import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/LogoApp.png";
import { ChevronDown, Menu, UserRound } from "lucide-react";
interface HeadingAdminProps {
  isOpen: boolean;
  handleToggleNavbar: () => void;
}

const HeadingAdmin = ({ isOpen, handleToggleNavbar }: HeadingAdminProps) => {
  const [, setIsHovered] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <header className="bg-white shadow">
      <div className="container flex justify-between items-center border-b border-b-[#E9EAEC] h-[64px] lg:max-w-[1748px]">
        <div className="flex items-center gap-20 px-16">
          <Link to={""}>
            <img src={logo} alt="" />
          </Link>
          <div
            className=" rounded-md bg-slate-100 hover:opacity-70 cursor-pointer"
            onClick={handleToggleNavbar}
          >
            <Menu className={`${isOpen ? "" : "rotate-180"} w-6 h-6`} />
          </div>
        </div>
        <div className="flex justify-between items-center gap-5">
          <div className="flex items-center">
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex justify-between items-center gap-5 px-5 py-1 rounded-md hover:bg-secondary z-10">
                <UserRound />
                <ChevronDown className={"w-3 h-3"} />
              </button>
              <div className="absolute after:contents w-full h-4 top-12"></div>
              {/* {isHovered && (
                <div className="absolute flex flex-col items-center bg-white min-w-[200px] right-0 z-50 shadow-md rounded-md top-[54px]">
                  <ItemDropdown
                    url={"/account.stacky.vn"}
                    icon={
                      <IconSignUp className={"w-6 h-6"} color={"#424242"} />
                    }
                    children={"Đăng xuất"}
                    onClick={handleLogout}
                  />
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// const ItemDropdown = ({ url, icon, children, onClick = () => {} }) => {
//   return (
//     <Link
//       to={url}
//       className="flex items-center p-3 w-full gap-4 h-10 text-[#424242] hover:bg-slate-100 cursor-pointer rounded-md"
//       onClick={onClick}
//     >
//       {icon}
//       <span>{children}</span>
//     </Link>
//   );
// };

export default HeadingAdmin;
