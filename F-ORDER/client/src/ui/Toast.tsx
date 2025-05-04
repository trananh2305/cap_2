import {addToast, ToastProvider, Button} from "@heroui/react";

const Toast = () => {
  return (
    <>
    <ToastProvider placement="top-right" toastOffset={10} />
    <div className="flex flex-wrap gap-2">
      {[
        ["Top Left", "top-left"],
        ["Top Center", "top-center"],
        ["Top Right", "top-right"],
        ["Bottom Left", "bottom-left"],
        ["Bottom Center", "bottom-center"],
        ["Bottom Right", "bottom-right"],
      ].map((position) => (
        <Button
          key={position[1]}
          variant={"flat"}
          onPress={() => {
            setPlacement(position[1]);
            addToast({
              title: "Toast title",
              description: "Toast displayed successfully",
            });
          }}
        >
          {position[0]}
        </Button>
      ))}
    </div>
  </>
  )
}

export default Toast