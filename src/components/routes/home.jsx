import React from 'react';
import Title from "../body/component/title.jsx";

const fillHome=()=>{
    let arr=[];
    for(let i=0; i<1000; i++){
        arr.push(<div>Hello World {i}</div>)
    }
    return arr;
}
const Home = () => {
    return <React.Fragment>
        <div>
            <Title title="Home"/>
            {fillHome()}
        </div>
    </React.Fragment>
};
export default Home;
