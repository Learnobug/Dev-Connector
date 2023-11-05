import React,{Fragment,useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { getposts } from '../../actions/post'
import Spin from '../layout/Spin'
import PostItem from './PostItem'
import PostForm from './PostForm'


const Posts = ({getposts,post:{posts,loading}}) => {
   
    useEffect(()=>{
        console.log("debug3");
        getposts();
        console.log(posts);
    },[getposts])
  
    return loading ? <Spin/> : (
        <Fragment>
            <h1 className='large text-primary'>Posts</h1>
            <p className='lead'>
                  <i className='fas fa-user'></i> Welcome to the community
            </p>
              <PostForm />
            <div className='posts'>
               {posts.map(post =>(
                <PostItem key={post._id} post={post}/>
               ))}
            </div>
        </Fragment>
    )
}

Posts.propTypes = {
 getposts:PropTypes.func.isRequired,
 post:PropTypes.object.isRequired,
}

const mapStateToProps =  state =>({
  post:state.post
})

export default connect(mapStateToProps,{getposts})(Posts)
