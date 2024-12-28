import React from 'react'
import './style.css';
import NavigatorChecks from "./component/navigatorChecks";
import ReactLazyChecks from "./component/ReactLazyChecks";
import CounterBatchingCheck from "./component/counterBatchingCheck";
import RecoilCheck from "./recoil";
// import ClosureCounterCheck from "./component/closureCounterCheck";
// import CommentApp from "comments/CommentApp";
// import ClientApp from "./client-app/clientApp";
// import ChatApp from "./StreamChat/StreamCheck";
// import ChatAppMain from "./StreamChat/StreamCheck";
// import Chart2 from "./charts/chart2";
// import { getMarks, getQtrs, getYrs } from "./charts/config";
// import QuickForm from './component/quickForm';
// import Combine from "./black_hawk/combine";
// import Chart1 from "./charts/chart1";
// import SelectBox from "./component/selectBox";
// import InputTag from "./component/inputTag";
// import TreeExample1 from "./component/treeExample1";
// import TreeExample2 from "./component/treeExample2";
// import CommentApp from "./comments/CommentApp";

function App() {
    // const data = [
    //     {value: 'one', label: 'one', color: 'red'},
    //     {value: 'two', label: 'two', color: 'green'},
    //     {value: 'three', label: 'three', color: 'blue'},
    //     {value: 'four', label: 'four', color: 'silver'},
    //     {value: 'five', label: 'five', color: 'black'},
    // ]
    // const handleChange = (selected) => {
    //     let isSingle = selected.length === undefined
    //     console.log(isSingle ? selected : selected.map(x => x.value))
    // }
    // const handleTagsCallBack=values=>{
    //     console.log('tags', values)
    // }
    // const chartHeight = 200
    // const chartWidth = 1000
    // const deepCopy = d => Object.values(d)
    // const yrs = getQtrs(2010, 2028)
    // const data = yrs.map(x => Math.round(100 + Math.random() * 1000, 2))
    // const data2 = yrs.map(x => Math.round(100 + Math.random() * 1000, 2))
    // // const data3 = yrs.map(x => Math.round(100 + Math.random() * 1000, 2))
    // // const data4 = yrs.map(x => Math.round(100 + Math.random() * 1000, 2))
    // const marks = yrs.map((x, i) => getMarks(x, i))
    // const defaultRange = ['2015Q1', '2020Q3']
    //
    // let dataset = [
    //     { name: 'line1', candrag: true, copy: deepCopy(data), data: deepCopy(data) },
    //     { name: 'line2', candrag: false, copy: deepCopy(data2), data: deepCopy(data2) },
    //     // { name: 'line3', candrag: true, copy: deepCopy(data3), data: deepCopy(data3) },
    //     // { name: 'line4', candrag: false, copy: deepCopy(data4), data: deepCopy(data4) }
    // ]
    // let dataset2 = JSON.parse(JSON.stringify(dataset))
    // let dataset3 = JSON.parse(JSON.stringify(dataset))
    // let dataset4 = JSON.parse(JSON.stringify(dataset))
    // let dataset5 = JSON.parse(JSON.stringify(dataset))
    // let dataset6 = JSON.parse(JSON.stringify(dataset))
    // let dataset7 = JSON.parse(JSON.stringify(dataset))
    // const charts = ['chart1', 'chart2', 'chart3', 'chart4', 'chart5', 'chart6', 'chart7']
    // const datasets = [dataset, dataset2, dataset3, dataset4, dataset5, dataset6, dataset7]
    // const colrors = [
    //     ['tomato', '#f2f2f2'],
    //     ['blue', '#f2f2f2'],
    //     ['purple', '#f2f2f2'],
    //     ['red', '#f2f2f2'],
    //     ['gray', '#f2f2f2'],
    //     ['black', '#f2f2f2'],
    //     ['magenta', '#f2f2f2']
    // ]
    //
    // const displayAllCharts = () => {
    //     return charts.map((name, i) => {
    //         return <Chart2 name={name}
    //             linesArray={datasets[i]}
    //             tickmarks={marks}
    //             color={colrors[i]}
    //             height={chartHeight}
    //             width={chartWidth}
    //             defaultRange={defaultRange}
    //         />
    //     })
    // }

    return <div className='center'>
        {/*<SelectBox multi={true} data={data} change={handleChange}/>*/}
        {/*<InputTag defaultTags={['devendra']} getValues={handleTagsCallBack}/>*/}
        {/*<TreeExample1/>*/}
        {/*<TreeExample2/>*/}

        {/*<h1>Black Hawk Test</h1>*/}
        {/*<span>put * to see all</span>*/}
        {/*<Combine/>*/}
        {/*<h1 className='xgray'>Drag points to make changes</h1>*/}
        {/*{displayAllCharts()}*/}
        {/*<ClosureCounterCheck/>*/}
        {/*<h2>hello test advance react+redux+TDD</h2>*/}
        {/*<CommentApp/>*/}
        {/*<ClientApp/>*/}
        {/*<ChatAppMain/>*/}
        {/*<CoWorking />*/}
        {/*<NavigatorChecks/>*/}

        {/*<h3>React Lazy Checks</h3>*/}
        {/*<ReactLazyChecks type={"form"}/>*/}
        {/*<ReactLazyChecks type={"type1"}/>*/}
        {/*<ReactLazyChecks type={"type2"}/>*/}
        {/*<ReactLazyChecks type={"type3"}/>*/}


        {/*<CounterBatchingCheck/>*/}
        <RecoilCheck/>




    </div>
}

export default App;
