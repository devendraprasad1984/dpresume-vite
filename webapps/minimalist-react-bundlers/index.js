import React from 'react'
import {createRoot} from 'react-dom/client'


const appContainer = document.getElementById('root')
function App(){
    return <React.Fragment>
        <div>Hello World!</div>
    </React.Fragment>
}
const Root = createRoot(appContainer)
const mainApp=<App/>
Root.render(mainApp)
