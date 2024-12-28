import pullApiWorker from "./pullApiWorker";

const workerFactory = () => {
  const blob = new Blob([["onmessage =" + pullApiWorker.toString()]], {
    type: "text/javascript",
  });

  const blobRefObject = URL.createObjectURL(blob);
  const workerRef = new Worker(blobRefObject);
  return workerRef;
};

export default workerFactory;
