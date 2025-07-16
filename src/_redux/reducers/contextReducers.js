export const contextReducers = (state, action) => {
  if (action.type === "INC") {
    return {
      ...state,
      count: state.count + action.count
    };
  } else if (action.type === "DEC") {
    return {
      ...state,
      count: state.count - action.count
    };
  } else {
    return state;
  }
};