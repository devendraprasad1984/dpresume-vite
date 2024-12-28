import React from "react";

const PlzWait = props => {
    const {msg} = props
    const xmsg = msg || 'please wait...'

    return <div>
        <h3>{xmsg}</h3>
    </div>
}
export default React.memo(PlzWait)
//React.memo is a pure function, when you pass same args , same output is returned, kind of cached result based on args. doesnt depend on state/props changes in it
