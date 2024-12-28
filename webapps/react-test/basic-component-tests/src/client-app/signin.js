import React from "react";
import {reduxForm, Field} from "redux-form";
import {compose} from "redux";
import {connect} from "react-redux";
import * as actions from './redux/actions'

const SignIp = props => {
  const {handleSubmit,history, signin, errorMessage} = props //handleSubmit is via the ReduxForm

  const onSubmit = (formProps) => {
    signin(formProps,()=>{
      history.push('/feature')
    }) //from redux actions
  }

  return <form onSubmit={handleSubmit(onSubmit)}>
    <fieldset>
      <label>Email</label>
      <Field name='email' type='text' component='input' autoComplete={'none'}/>
    </fieldset>
    <fieldset>
      <label>Password</label>
      <Field name='password' type='password' component='input' autoComplete={'none'}/>
    </fieldset>
    <div>{errorMessage}</div>
    <button type='submit'>Sign In</button>
  </form>
}

const mapStateToProps = state => {
  return {
    errorMessage: state.auth.errorMessage
  }
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({form: 'signin'})
)(SignIp)