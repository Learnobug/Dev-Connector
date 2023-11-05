import axios from "axios";
import { setAlert } from "./alert";
import {GET_PROFILES,CLEAR_PROFILE,ACCOUNT_DELETED, GET_PROFILE,PROFILE_ERROR , UPDATE_PROFILE,GET_REPOS} from "./type";
import { useNavigate } from "react-router-dom";
import PrivateRoute from "../components/routing/PrivateRoute";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
  } from "react-router-dom";

import Dashboard from "../components/dashboard/Dashboard";
const seturl ="http://localhost:5000"

//get current user profile
export const getCurrentProfile = () => async dispatch =>{
    try {
    const res =await axios.get(`${seturl}/api/profile/me`);
    dispatch({
        type:GET_PROFILE,
        payload:res.data
    });

        
    } catch (err) {
       dispatch({
        type:PROFILE_ERROR,
        payload:{msg: err.response.statusText,status: err.response.status}
       }) 
    }
}

//get all profiles
export const getProfiles = () => async dispatch =>{
  dispatch({type:CLEAR_PROFILE});
  try {
  const res =await axios.get(`${seturl}/api/profile`);
  dispatch({
      type:GET_PROFILES,
      payload:res.data
  });

      
  } catch (err) {
     dispatch({
      type:PROFILE_ERROR,
      payload:{msg: err.response.statusText,status: err.response.status}
     }) 
  }
}

//get profile by id
export const getProfileById = userId => async dispatch =>{

  try {
  const res =await axios.get(`${seturl}/api/profile/${userId}`);
  dispatch({
      type:GET_PROFILE,
      payload:res.data
  });

      
  } catch (err) {
     dispatch({
      type:PROFILE_ERROR,
      payload:{msg: err.response.statusText,status: err.response.status}
     }) 
  }
}

//get Github repos
export const getGithubRepos = username => async dispatch =>{

  try {
  const res =await axios.get(`${seturl}/api/profile/github/${username}`);
  dispatch({
      type:GET_REPOS,
      payload:res.data
  });

      
  } catch (err) {
     dispatch({
      type:PROFILE_ERROR,
      payload:{msg: err.response.statusText,status: err.response.status}
     }) 
  }
}

//create or update a profile
export const createProfile = (formData,edit=false) => async dispatch =>
{
  console.log("repeated1");
  try {
   const config ={
    headers:{
        'Content-Type':'application/json'
    }
   }
   const res= await axios.post(`${seturl}/api/profile`,formData,config);
   console.log("repeated2");
   dispatch({
    type: GET_PROFILE,
    payload: res.data
   })
   console.log("repeated3");
   dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created','success'));

  } catch (err) {
    const errors = err.response.data.errors;
    if(errors)
    {
     errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
    }
    dispatch({
        type:PROFILE_ERROR,
        payload:{msg: err.response.statusText,status: err.response.status}
       }) 
  }
}

//add experince

export const addExperince = (formData)=> async dispatch =>{
  console.log("debug13");
  
  try {
    const config ={
     headers:{
         'Content-Type':'application/json'
     }
    }
    
    const res= await axios.put(`${seturl}/api/profile/experince`,formData,config);
    
    dispatch({
     type: UPDATE_PROFILE,
     payload: res.data
    })
    console.log("debug3");
    dispatch(setAlert("Experince Added",'success'));
  
 
   } catch (err) {
     const errors = err.response.data.errors;
     if(errors)
     {
      errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
     }
     dispatch({
         type:PROFILE_ERROR,
         payload:{msg: err.response.statusText,status: err.response.status}
        }) 
   }
}

//add eductaion

export const addEducation = (formData)=> async dispatch =>{
  try {
    const config ={
     headers:{
         'Content-Type':'application/json'
     }
    }
    const res= await axios.put(`${seturl}/api/profile/education`,formData,config);
    
    dispatch({
     type: UPDATE_PROFILE,
     payload: res.data
    })
    dispatch(setAlert("Education Added",'success'));
 
   } catch (err) {
     const errors = err.response.data.errors;
     if(errors)
     {
      errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
     }
     dispatch({
         type:PROFILE_ERROR,
         payload:{msg: err.response.statusText,status: err.response.status}
        }) 
   }
}

//Delete experince
export const deleteExperience = id => async dispatch =>{
  try{
      const res= await axios.delete(`${seturl}/api/profile/experience/${id}`);

      dispatch({
        type:UPDATE_PROFILE,
        payload:res.data
      });
      dispatch(setAlert("Experience Removed",'success'));
  }
  catch(err)
  {
    dispatch({
      type:PROFILE_ERROR,
      payload:{msg: err.response.statusText,status: err.response.status}
     }) ;
    }
}


//Delete education
export const deleteEducation = id => async dispatch =>{
  try{
      const res= await axios.delete(`${seturl}/api/profile/education/${id}`);

      dispatch({
        type:UPDATE_PROFILE,
        payload:res.data
      });
      dispatch(setAlert("Education Removed",'success'));
  }
  catch(err)
  {
    dispatch({
      type:PROFILE_ERROR,
      payload:{msg: err.response.statusText,status: err.response.status}
     }) ;
    }
}

//delete account & profile
export const deleteAcoount = () => async dispatch =>{
  if(window.confirm('Are You sure? This can Not Be undone!')){
  try{
      await axios.delete(`${seturl}/api/profile`);
      dispatch({
        type:CLEAR_PROFILE,
      });
      dispatch({
        type:ACCOUNT_DELETED
      });
     
      dispatch(setAlert("Your Account is permanently deleted"));
  }
  catch(err)
  {
    dispatch({
      type:PROFILE_ERROR,
      payload:{msg: err.response.statusText,status: err.response.status}
     }) ;
    }
  }
  }
