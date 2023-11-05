import React,{Fragment,useState,useEffect} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import { setAlert } from '../../actions/alert';
import  ReactDOM  from 'react-dom';
import { Link,useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'
import { login } from '../../actions/auth';
const Login = ({login,isAuthenticated}) =>  {
  const navigate = useNavigate();
  const [formdata,setformData]=useState({
    email:'',
    password:'',
   });
   const {email,password}=formdata;
   const onChange = e => setformData({...formdata,[e.target.name]:e.target.value});
   const onSubmit = async e =>{
    e.preventDefault();
    console.log('success');
     login(email,password);
   }
  //  redirect is logged in
   useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
      return (
      <Fragment>
            <h1 className="large text-primary">Sign In</h1>
          <p className="lead"><i className="fas fa-user"></i> Sign In Your Account</p>
          <form className="form" onSubmit={e=> onSubmit(e)}>
            
            <div className="form-group">
              <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required/>
              <small className="form-text"
                >This site uses Gravatar so if you want a profile image, use a
                Gravatar email</small
              >
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                minLength="6"
                value={password} onChange={e => onChange(e)} required
              />
            </div>
           
            <input type="submit" className="btn btn-primary" value="Login" />
          </form>
          <p className="my-1">
            Dont't have an account? <Link to="/Register">Sign In</Link>
          </p>
        </Fragment>)
      }
Login.propTypes = {
  login:PropTypes.func.isRequired,
  isAuthenticated:PropTypes.bool,
}
const mapStateToProps = state =>({
   isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps,{login})(Login);
