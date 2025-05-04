import { Link } from "react-router-dom";
const CartItem = ({
  quantity,
  price,
  name,
  id,
  note,
  imageUrl
}: {
  quantity: number;
  price: number;
  name: string;
  id:string;
  note?:string
  imageUrl: string
}) => {

  return (
    <div className="flex gap-2 items-center pb-2 justify-center border-b-2 w-full">
      <img src={imageUrl} alt="" className="lg:size-[10vw] size-[13vw] rounded-sm object-cover" />
      <div className="flex flex-col flex-1 justify-center gap-4 w-full">
        <div className="flex justify-between items-center ">
          <div>
            <span>{name} </span>
            <span className="text-sm text-primary-100 font-bold">x{quantity}</span>
          </div>
          <span className="font-medium text-primary-100">{(price * quantity).toLocaleString("vi-VN")} VNĐ</span>
        </div>
        <div className="flex w-[70%] ">
          <Link to={`/menu/${id}`} className="text-primary-100"> Chỉnh sửa</Link>
          {
            note && <span className="ml-5 line-clamp-2 text-slate-500 flex-1 ">*{`(${note})`} </span>
          }
          
        </div>
      </div>
    </div>
  );
};

export default CartItem;
