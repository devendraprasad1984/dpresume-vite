import React, {useEffect, useState} from 'react'
import urls from "../urls";

const AppVersion=()=>{
    const [verFromBackend, setVersionFromBackend]=useState('')
    const [verFromUI, setVersionFromUI]=useState('')
    const [err, setErr]=useState('')

    useEffect(()=>{
        fetch(urls.ui).then(r=>r.json()).then(d=>setVersionFromBackend(d.version)).catch(e=>setErr(e))
        fetch(urls.manifest).then(r=>r.json()).then(d=>setVersionFromUI(d.version)).catch(e=>setErr(e))
    },[])

    return <div>
        <h2>app version: {verFromBackend} vs {verFromUI}</h2>
        <h4>{verFromBackend!==verFromUI ? 'VERSION has been changed, reloading':'versions are same'}</h4>
    </div>
}

export default AppVersion