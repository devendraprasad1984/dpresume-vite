export default (message) => {
  const { uri } = message.data;
  // let start=new Date().getMilliseconds()
  // let endTime=()=>(new Date().getMilliseconds() - start)
  // console.time("pullapi"), console.timeEnd("pullapi");
  // var start = window.performance.now()
  // var end = window.performance.now()
  let start = () => console.time("pullapi");
  let endTime = () => console.timeEnd("pullapi");
  // const {uri, callback, msg, msgType} = message.data
  // console.log('message from worker', message.data)
  fetch(uri)
    .then((res) => {
      return res.json();
    })
    .then((data) => postMessage({ data, time: endTime() }))
    .catch((err) => postMessage({ error: err, time: endTime() }));
};
