import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../reducers/counters/counterReducer.js";

const mainStore = configureStore({
  reducer: {
    counter: counterReducer
  }
});
export default mainStore;