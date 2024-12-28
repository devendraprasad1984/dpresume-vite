import React from "react"

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: '',
      errorInfo: ''
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true, error};
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({error, errorInfo})
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <React.Fragment>
        <div className='errorBg'>
          <div className='whiteOverlay h100'>
            <h1 className='xred'>Something went wrong.</h1>
            <div>
              <span>Please contact admin: </span>
              <a href=""></a>
            </div>
            <div className='size10'>
              <p>{JSON.stringify(this.state.error)}</p>
              <p>{JSON.stringify(this.state.errorInfo)}</p>
            </div>
          </div>
        </div>
      </React.Fragment>
    }

    return this.props.children;
  }
}