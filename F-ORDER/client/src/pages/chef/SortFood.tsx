import Loading from "@/components/Loading";
import { socket } from "@/provider/SocketProvider";
import {
  OrderItem,
  useGetItemByCategoryIdQuery,
  useUpdateOrderStatusMutation,
} from "@/service/kitchenApi";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table";

import { useParams } from "react-router-dom";
import CheckTable from "@/components/chef/CheckTable";
import SelectChef from "@/components/chef/SelectChef";
import { STATUS } from "@/enum/status";
import { toast } from "sonner";

const SortFood = () => {
  const { id, category } = useParams();
  const [isPenđing, setIsPending] = useState("PENDING");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenChef, setIsModalOpenChef] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [status, setStatus] = useState("PENDING");
  const [itemId, setItemId] = useState("");
  const { data, isLoading, refetch } = useGetItemByCategoryIdQuery({
    id: id || "",
  });
  const [updateOrderItem] = useUpdateOrderStatusMutation();

  console.log("data line 21", data);

  useEffect(() => {
    socket.on("tableStatusChanged", (data) => {
      console.log("tableStatusChanged");
      if (data) {
        refetch();
      }
    });
    socket.on("kitchenStatusUpdated", (data) => {
      console.log("kitchenStatusUpdated");
      if (data) {
        refetch();
      }
    });
    socket.on("orderStatusChanged", (data) => {
      console.log("orderStatusChanged");
      if (data) {
        refetch();
      }
    });
    socket.on("orderItemStatusUpdated", (data) => {
      console.log("orderItemStatusUpdated");
      if (data) {
        refetch();
      }
    });
    return () => {
      socket.off("tableStatusChanged");
      socket.off("kitchenStatusUpdated");
      socket.off("orderStatusChanged");
      socket.off("orderItemStatusUpdated");
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  const handleUpdateOrderStatus = async (
    status: string,
    orderItemIds: string[]
  ) => {
    try {
      console.log("first", orderItemIds);
      await updateOrderItem({
        status,
        orderItemIds,
      }).unwrap();
      toast.success("Cập nhật trạng thái món thành công");
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const handleModalToggle = (order: OrderItem) => {
    // Cập nhật thông tin món ăn khi nhấn nút "Xem bàn"
    console.log("order", order);
    setSelectedOrder(order);
    setItemId(order.itemId); // Cập nhật itemId từ order
    setStatus(order.status); // Cập nhật status từ order
    setIsModalOpen(!isModalOpen);
  };

  const handleModalAllChef = (order: OrderItem) => {
    setIsModalOpenChef(!isModalOpenChef);
    setSelectedOrder(order);
  };
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="h-16 flex w-full items-center px-10 bg-gradient-to-r from-primary-100 to-primary-400">
        <h3 className="text-white font-bold text-xl">{category}</h3>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setIsPending("PENDING")}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none transition transform hover:scale-105 active:bg-yellow-700 border "
          >
            Món đợi xử lý
          </button>
          <button
            onClick={() => setIsPending("PROCESSING")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none transition transform hover:scale-105 active:bg-green-700 border "
          >
            Món đang làm
          </button>
        </div>
      </div>
      <div className="p-6 mr-3 overflow-y-auto h-[75vh]">
        <Table className="w-full">
          <TableHeader className="text-sm text-black">
            <TableRow>
              <TableHead className="p-2 w-[5%] text-center">STT</TableHead>
              <TableHead className="p-2 w-[25%] text-center">
                Tên món ăn
              </TableHead>
              <TableHead className="p-2 w-[15%] text-center">
                Số lượng món
              </TableHead>
              <TableHead className="p-2 w-[10%] text-center">
                Thời gian cập nhật
              </TableHead>
              <TableHead className="p-2 w-[10%] text-center">
                Trạng thái
              </TableHead>
              <TableHead className="p-2 w-[10%] text-center">
                Chức năng
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              ?.filter((order) => order.status === isPenđing)
              .map((order, index) => (
                <TableRow key={index} className="font-medium">
                  <TableCell className="p-2 text-center">{index + 1}</TableCell>
                  <TableCell className="p-2 text-center">
                    {order.name}
                  </TableCell>
                  <TableCell className="p-2 text-center">
                    {order.quantity}
                  </TableCell>
                  <TableCell className="p-2 text-center">
                    {new Date(order.updatedAt).toLocaleString().split(",")[1]}
                  </TableCell>
                  <TableCell className="p-2 text-center">
                    {order.status === "PENDING" ? (
                      <span className="text-yellow-500">Chờ xử lý</span>
                    ) : order.status === "PROCESSING" ? (
                      <span className="text-green-700">Đang chế biến</span>
                    ) : (
                      <span className="text-blue-600">Đã hoàn thành</span>
                    )}
                  </TableCell>
                  <TableCell className="p-2 text-center">
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        onClick={() => handleModalToggle(order)}
                        className="bg-blue-500 hover:bg-blue-800 text-white px-3 py-1 rounded-xl whitespace-nowrap"
                      >
                        Xem bàn
                      </button>
                      {isPenđing === STATUS.PENDING ? (
                        <button
                          onClick={() => handleModalAllChef(order)}
                          className="bg-primary-100 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl whitespace-nowrap"
                        >
                          Chọn đầu bếp
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleUpdateOrderStatus(STATUS.COMPLETED, [
                              order.orderItemId,
                            ])
                          }
                          className="bg-green-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl whitespace-nowrap"
                        >
                          Hoàn thành
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {isModalOpen && selectedOrder && (
          <CheckTable
            itemId={itemId}
            status={status}
            key={itemId}
            setIsModalOpen={setIsModalOpen}
          />
        )}
        {isModalOpenChef && selectedOrder && (
          <SelectChef
            setIsModalOpenChef={setIsModalOpenChef}
            order={{
              orderItemIds: [selectedOrder.orderItemId],
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SortFood;
