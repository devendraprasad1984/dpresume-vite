import React, {Suspense} from 'react'


const Component1 = (props) => {
    return <>
        <h2>Component Type1</h2>
    </>
}
const Component2 = (props) => {
    return <>
        <h2>Component Type2</h2>
    </>
}
const Component3 = (props) => {
    return <>
        <h2>Component Type3</h2>
    </>
}

const formLazyObject = {
    form: React.lazy(() => import('./quickForm')),
    type1: Component1,
    type2: Component2,
    type3: Component3
}

function ReactLazyChecks(props) {
    const {type} = props
    const ComponentBasedOnType = formLazyObject[type]
    return <>
        <Suspense fallback={<div>Loading...</div>}>
            <ComponentBasedOnType/>
        </Suspense>
    </>
}

export default ReactLazyChecks