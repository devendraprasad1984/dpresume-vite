import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import counterHelper from "./counterHelper.js";

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
    },
  },
  extraReducers: (builder) => {
    builder.addCase(counterHelper.counterAsyncIncrement.pending, counterHelper.onPending)
    .addCase(counterHelper.counterAsyncIncrement.fulfilled, counterHelper.onFulfilledIncrement)
    .addCase(counterHelper.counterAsyncIncrement.rejected, counterHelper.onRejected)
    .addCase(counterHelper.counterAsyncDecrement.pending, counterHelper.onPending)
    .addCase(counterHelper.counterAsyncDecrement.fulfilled, counterHelper.onFulfilledDecrement)
    .addCase(counterHelper.counterAsyncDecrement.rejected, counterHelper.onRejected);
  }
});
export const counterActions = counterSlice.actions;
export default counterSlice.reducer;