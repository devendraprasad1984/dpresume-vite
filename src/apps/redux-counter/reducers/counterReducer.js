import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const counterAdapter = createEntityAdapter();
const counterInit = counterAdapter.getInitialState({
  count: 0
});
const counterSlice = createSlice({
  name: "counter",
  initialState: counterInit,
  reducers: {
    //counterActions
    increment: (state, action) => {
      state.count = state.count + action.payload.value;
    },
    decrement: (state, action) => {
      state.count = state.count - action.payload.value;
    }
  }
});
export const counterActions = counterSlice.actions;
export default counterSlice.reducer;