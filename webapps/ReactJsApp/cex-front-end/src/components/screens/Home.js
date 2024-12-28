import React from "react"
import HomeUIForm from "./HomeUIForm";

const Home = props => {
    const {header} = props
    return <div>
        <h2>{header}</h2>
        <HomeUIForm/>
    </div>
}

export default Home
