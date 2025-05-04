import FiguresPostChart from "../../components/admin/FiguresPostChart";
import ItemsDashboard from "../../components/admin/ItemsDashboard";
import RevenueChart from "../../components/admin/RevenueChart";
import TopDishFavorite from "../../components/admin/TopDishFavourite";
import SortIcon from "../../icons/SortIcon";

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-5 p-5 my-5 mr-5 w-full">
      <ItemsDashboard />
      <div className="flex flex-col gap-5 border-2 rounded">
        <RevenueChart />
      </div>
      <div className="grid gap-5 h-[350px]">
        <div className="bg-white p-5 h-full rounded border-2">
          <div className="flex justify-between items-center text-text-100">
            <h3 className="text-xl font-medium">Top món ăn được yêu thích</h3>
            <div
              className="flex items-center text-[12px] font-bold px-3 py-1 bg-[#F6F6F6] rounded-xl gap-2 cursor-pointer"
              // onClick={() => {
              //   handleSort();
              // }}
            >
              <span>Sắp xếp</span>
              <SortIcon />
            </div>
          </div>
          <TopDishFavorite />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
