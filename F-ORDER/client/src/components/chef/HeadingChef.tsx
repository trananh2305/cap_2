import { Link, useNavigate } from "react-router-dom";
import Logo from "@/icons/Logo";
import { Table, useGetAllTablesQuery } from "@/service/tableApi";
import Loading from "../Loading";
import { EllipsisVertical } from "lucide-react";

interface HeadingChefProps {
  isOpen: boolean;
  handleToggleNavbar: () => void;
}

const HeadingChef: React.FC<HeadingChefProps> = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllTablesQuery();
  if (isLoading) {
    return <Loading />;
  }

  const occupiedTables =
    data?.result?.filter((table: Table) => table.status === "OCCUPIED") || [];

  return (
    <header className="bg-yellow-400 shadow w-screen h-[64px] pl-20 pr-4">
      <div className=" flex gap-2 items-center border-b border-b-[#E9EAEC] h-full w-full">
        <Link to={"/chef/comfirm-order"} className="">
          <Logo className="" fill="white" />
        </Link>
        <span className=" text-xl font-bold ml-28 w-20">Số bàn</span>
        <div
          className="flex items-center gap-4  w-full flex-1 overflow-x-auto "
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-2 py-2 flex-1 cursor-pointer ">
            {occupiedTables.length > 0 ? (
              occupiedTables.map((table: Table) => (
                <span
                  key={table._id}
                  onClick={() =>
                    navigate(`/chef/table/${table._id}`, {
                      state: { tableName: table.tableNumber },
                    })
                  }
                  className="bg-yellow-200 px-2 py-2 rounded-lg border-2 border-yellow-600 hover:bg-yellow-300 w-20 flex justify-center"
                >
                  {table.tableNumber}
                </span>
              ))
            ) : (
              <span className="text-gray-700 italic">Không có bàn nào!!</span>
            )}
          </div>
        </div>
        <Link
          to="/chef/table"
          className="btn border-2 !border-black !text-black w-fit"
        >
          <EllipsisVertical />
        </Link>
      </div>
    </header>
  );
};

export default HeadingChef;
