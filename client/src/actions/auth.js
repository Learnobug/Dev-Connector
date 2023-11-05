import axios from 'axios'
import {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    LOGIN_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE
} from './type'
import { setAlert } from './alert'
import setAuthToken from '../utils/setAuthToken';

const seturl ="http://localhost:5000"

//Load USER
export const  loadUser = () => async dispatch => {
   if(localStorage.token)
   {
     setAuthToken(localStorage.token);
   }
   try {
    const res=await axios.get(`${seturl}/api/auth`);
    dispatch({
        type:USER_LOADED,
        payload:res.data
    })
   } catch (err) {
    dispatch({
        type:AUTH_ERROR,
    })
   }
}



//Register User
export const register = ({name,email,password}) => async dispatch =>{
    const config ={
        headers:{
            "Content-Type":"application/json"
        }
    }
    const body =JSON.stringify({name,email,password});
    console.log(body);
    try{
        console.log("registered");
        const res =await axios.post("http://localhost:5000/api/users",body,config);
    
        dispatch ({
            type:REGISTER_SUCCESS,
            payload:res.data
        });
      
        dispatch(loadUser());
    }
    catch(err)
    {
        const errors = err.response.data.errors;
           if(errors)
           {
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
           }

        dispatch ({
            type:REGISTER_FAIL,
        })
    }

}
//Login User

export const login = (email,password) => async dispatch =>{
    const config ={
        headers:{
            "Content-Type":"application/json"
        }
    }
    const body =JSON.stringify({email,password});
    try{
        const res =await axios.post(`${seturl}/api/auth`,body,config);
        dispatch ({
            type:LOGIN_SUCCESS,
            payload:res.data
        });
        dispatch(loadUser());
    }
    catch(err)
    {
        const errors = err.response.data.errors;
           if(errors)
           {
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
           }

        dispatch ({
            type:LOGIN_FAIL,
        })
    }

}
//LogOut
export const logout = () =>dispatch =>{
    dispatch({type:CLEAR_PROFILE});
    dispatch({type:LOGOUT});
}