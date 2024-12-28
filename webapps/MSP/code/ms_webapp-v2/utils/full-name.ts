/**
 * Generate a full name
 */

const fullName = (strings: string[]) => {
  return strings?.filter((item) => !!item)?.join(" ");
};

export default fullName;
