export const counterSelector = (state) => {
  console.log("from counterSelector", state);
  return state.counter.count;
};
const allSectors = {
  counterSelector
};
export default allSectors;