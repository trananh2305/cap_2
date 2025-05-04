
import { Soup, Fish, PlusCircle, IceCreamBowl , Salad, CupSoda } from "lucide-react";

const CategoryIcon = ({ id }: { id: string }) => {
  const category = [
    {
      id: "67f128b5484eecf70f8623c0",
      Icon: Soup,
    },
    {
      id: "67f128fa484eecf70f8623c2",
      Icon: Fish,
    },
    {
      id: "67f12934484eecf70f8623c4",
      Icon: Salad,
    },
    {
      id: "67f1295a484eecf70f8623c6",
      Icon: PlusCircle,
    },
    {
      id: "67f1299c484eecf70f8623c8",
      Icon: IceCreamBowl,
    },
    {
      id: "67f92beb57c61e12a9d5eb5c",
      Icon: CupSoda  ,
    },
    
  ];
  const IconComponent = category.filter((item) => item.id === id)[0].Icon;

  return <IconComponent className="size-10 lg:size-20" />;
};

export default CategoryIcon;
