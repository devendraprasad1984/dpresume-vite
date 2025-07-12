import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../reducers/counterReducer.js";

const mainStore = configureStore({
  reducer: {
    counter: counterReducer
  }
});
export default mainStore;