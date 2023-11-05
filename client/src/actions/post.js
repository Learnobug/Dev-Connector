import axios from 'axios'
import { setAlert } from './alert'
import {
    DELETE_POST,
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    ADD_POST,
    GET_POST,
    ADD_COMMENT,
    REMOVE_COMMENT
}from './type'
const seturl ="http://localhost:5000"

//get posts

export const getposts = () => async dispatch =>{
    try{
    const res=await axios.get(`${seturl}/api/posts`);

    dispatch({
        type: GET_POSTS,
        payload:res.data
    })
    }
    catch(err)
    {
        dispatch({
            type:POST_ERROR,
            payload:{msg: err.response.statusText,status: err.response.status}
           }) 
    }
} 

//add likes

export const addLike = id => async dispatch =>{
    try{
    const res=await axios.put(`${seturl}/api/posts/like/${id}`);

    dispatch({
        type: UPDATE_LIKES,
        payload:{id,likes:res.data}
    })
    }
    catch(err)
    {
        dispatch({
            type:POST_ERROR,
            payload:{msg: err.response.statusText,status: err.response.status}
           }) 
    }
}
//Remove likes

export const removeLike = id => async dispatch =>{
    try{
    const res=await axios.put(`${seturl}/api/posts/unlike/${id}`);

    dispatch({
        type: UPDATE_LIKES,
        payload:{id,likes:res.data}
    })
    }
    catch(err)
    {
        dispatch({
            type:POST_ERROR,
            payload:{msg: err.response.statusText,status: err.response.status}
           }) 
    }
} 

//Delete post

export const deletePost = id => async dispatch =>{
    try{
    
    await axios.delete(`${seturl}/api/posts/${id}`);
  
    dispatch({
        type: DELETE_POST,
        payload:id
    })
    dispatch(setAlert('post Removed','success'))
    }
    catch(err)
    {
        dispatch({
            type:POST_ERROR,
            payload:{msg: err.response.statusText,status: err.response.status}
           }) 
    }
} 

//add post

export const addPost = formData => async dispatch =>{
    
    const config ={
       headers:{
        'Content-Type':'application/json'
       } 
    }
    try{

    const res=await axios.post(`${seturl}/api/posts`,formData,config);

    dispatch({
        type: ADD_POST,
        payload:res.data
    })
    dispatch(setAlert('post created','success'))
    }
    catch(err)
    {
        dispatch({
            type:POST_ERROR,
            payload:{msg: err.response.statusText,status: err.response.status}
           }) 
    }
} 

//get post

export const getpost = id => async dispatch =>{
    try{
    const res=await axios.get(`${seturl}/api/posts/${id}`);

    dispatch({
        type: GET_POST,
        payload:res.data
    })
    }
    catch(err)
    {
        dispatch({
            type:POST_ERROR,
            payload:{msg: err.response.statusText,status: err.response.status}
           }) 
    }
} 

//add comment

export const addComment = (postId,formData) => async dispatch =>{
    
    const config ={
       headers:{
        'Content-Type':'application/json'
       } 
    }
    try{

    const res=await axios.post(`${seturl}/api/posts/comment/${postId}`,formData,config);

    dispatch({
        type: ADD_COMMENT,
        payload:res.data
    })
    dispatch(setAlert('Comment added','success'))
    }
    catch(err)
    {
        dispatch({
            type:POST_ERROR,
            payload:{msg: err.response.statusText,status: err.response.status}
           }) 
    }
} 

//delete comment

export const deleteComment = (postId,commentId) => async dispatch =>{

    try{

    const res=await axios.delete(`${seturl}/api/posts/comment/${postId}/${commentId}`);

    dispatch({
        type: REMOVE_COMMENT,
        payload:commentId
    })
    dispatch(setAlert('Comment removed','success'))
    }
    catch(err)
    {
        dispatch({
            type:POST_ERROR,
            payload:{msg: err.response.statusText,status: err.response.status}
           }) 
    }
} 
