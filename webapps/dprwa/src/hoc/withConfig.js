import React from 'react'

const WithConfig = (Component) => {
  const otherInjectedProps = {
    isAdmin: localStorage.getItem("isAdmin") === 'false' ? false : true,
    userid: localStorage.getItem("userid") || 1,
  }
  return props => <Component {...otherInjectedProps} {...props}/>
}

export default WithConfig