import { useGetItemsBestSaleQuery } from "@/service/adminAPI";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table";



const TopDishFavourite = () => {
  const { data } = useGetItemsBestSaleQuery();

  return (
    <Table className="mt-5">
      <TableHeader className="text-sm text-[#949494]">
        <TableRow>
          <TableHead className="text-center w-[5%]">STT</TableHead>
          <TableHead className="text-center w-[45%]">Tên món ăn</TableHead>
          <TableHead className="text-center w-[30%]">Loại món ăn</TableHead>
          <TableHead className="text-center w-[20%]">Số lượt đặt</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.result?.slice(0, 5).map((item, index) => (
          <TableRow className="font-medium" key={index}>
            <TableCell className="text-center">
              <span>{index + 1}</span>
            </TableCell>
            <TableCell className="text-center">
              <span>{item?.name}</span>
            </TableCell>
            <TableCell className="text-center">
              <span>{item?.categoryName}</span>
            </TableCell>
            <TableCell className="text-center">
              <span>{item?.count}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TopDishFavourite;
