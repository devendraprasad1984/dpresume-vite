const getVideoID = (url: string): string => {
  return url.split("watch?v=")[1];
};

export default getVideoID;
