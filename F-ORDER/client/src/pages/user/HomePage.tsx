import { Search } from "lucide-react";
import background from "../../assets/BackgroundHomePage.png";
import Footter from "@/components/user/Footter";

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen absolute top-0 w-full">
      <div className="relative h-fit w-full text-white">
          <img src={background} alt="" className="w-full" />
          <div className="absolute w-full h-full flex flex-col top-0">
            <div className="w-full h-[50%] flex flex-col">

              {/* Ô tìm kiếm */}
              <div className="flex-1 flex items-end justify-center lg:py-[4vw] text-[2vw] lg:text-[1.5vw]">
                <div className="flex lg:gap-4 gap-2 items-center bg-white rounded-xl px-2 lg:py-1 w-[40vw]">
                  <Search className="size-[5vw] lg:size-[2vw]" color="#6F767E" />
                  <input
                    placeholder="Bạn đang cần tìm món?"
                    className=" w-full  border-none outline-none text-black"
                  />
                </div>
              </div>
            </div>

            {/* Tiêu đề trang */}
            <div className="flex-1 relative lg:text-[1.8vw] text-[2.7vw]  font-akaya">
              <span className="absolute top-3 lg:top-0 left-[20%]">
                Tinh hoa ẩm thực Đà Nẵng.
              </span>
              <span className="absolute top-[40%] left-1/2 lg:w-[30%] w-[45vw] transform -translate-x-1/2">
                Nhà hàng mang đậm hương vị Đà Nẵng, giữ nguyên hương vị truyền
                thống.
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1"></div>
      <Footter />
    </div>
  );
};

export default HomePage;
