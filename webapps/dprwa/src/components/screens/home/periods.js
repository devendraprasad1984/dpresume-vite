import React, {useEffect, useState} from "react";


let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let curDate = new Date();
let curPeriod = months[curDate.getMonth()] + " " + curDate.getFullYear();

const preparePeriod = () => {
  let years = []
  for (let i = 2021; i < 2045; i++) {
    years.push(
      months
        .map((x) => {
          let cval = x + " " + i;
          let xelem =
            cval === curPeriod
              ? <option key={cval} value={cval} selected>{cval}</option>
              : <option key={cval} value={cval}>{cval}</option>
          return xelem;
        })
    );
  }
  return years
}


function Periods(props) {
  const {onchange} = props
  const [years, setYears] = useState([]);
  const [selected, setSelected] = useState(curPeriod)

  useEffect(() => {
    setYears(preparePeriod())
    onchange(selected)
  }, [])

  const handleChange=(e)=>{
    let {value} = e.target
    setSelected(value)
    onchange(value)
  }

  return <select className="wid40" onChange={handleChange} value={selected}>{years}</select>;
}

export default Periods