import React from 'react'

const Logger: any = (Component: React.FC): any => {
    const otherProps = {}
    console.log('logging to console or server', Component.name)
    return (props: any) => <Component {...otherProps} {...props}/>
}
export default Logger