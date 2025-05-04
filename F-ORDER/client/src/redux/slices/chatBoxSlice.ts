import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: string;
  message: string | Item[];
  role: "chat" | "user";
}

interface Item {
  _id:string;
  name: string;
  price: string;
  imageUrl?:string;
}

const initialState: Message[] = [
    {
      id: "1",
      message: "Bạn muốn giúp gì?",
      role: "chat",
    },
  ];

export const chatBoxSlice = createSlice({
  name: "chatbox",
  initialState,
  reducers: {
    addToBox: (state, action: PayloadAction<Message>) => {
      state.push(action.payload)
    },
    
  },
});

// Export actions and reducer
export const {addToBox } = chatBoxSlice.actions;
export default chatBoxSlice.reducer;
