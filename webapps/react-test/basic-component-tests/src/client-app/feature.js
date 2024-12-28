import React from "react";
import RequireAuth from "../hoc/requireAuth";

const Feature=()=>{
    return <div>
        <h2>feature in app</h2>
    </div>
}

export default RequireAuth(Feature)