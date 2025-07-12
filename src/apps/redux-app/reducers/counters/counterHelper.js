import { createAsyncThunk } from "@reduxjs/toolkit";
import oneliners from "../../../../../oneliners/oneliners.js";

const counterAsyncIncrement = createAsyncThunk("counter/inc-async", async ({value}) => {
    await new Promise((res) => {
      setTimeout(() => res("completed"), 2000);
    });
    return {value};
  }
);
const counterAsyncDecrement = createAsyncThunk("counter/dec-async", async ({value}) => {
    await new Promise((res) => {
      setTimeout(() => res("completed"), 4000);
    });
    return {value};
  }
);
const onPending = (state, action) => {
  oneliners.domHelpers.attachLoader("Please wait...");
  console.log("counter state is pending", action);
};
const onFulfilledIncrement = (state, action) => {
  console.log("counter state is fulfilled", action);
  state.count = state.count + action.payload.value;
  oneliners.domHelpers.detachLoader();
};
const onFulfilledDecrement = (state, action) => {
  console.log("counter state is fulfilled", action);
  state.count = state.count - action.payload.value;
  oneliners.domHelpers.detachLoader();
};
const onRejected = (state, action) => {
  console.log("counter state is rejected", action);
  oneliners.domHelpers.detachLoader();
};
const counterHelper = {
  counterAsyncIncrement,
  counterAsyncDecrement,
  onPending,
  onFulfilledIncrement,
  onFulfilledDecrement,
  onRejected
};
export default counterHelper;