import React,{Fragment,useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Spin from '../layout/Spin'
import { getpost } from '../../actions/post'
import { Link, useParams } from 'react-router-dom'
import PostItem from '../Posts/PostItem'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

const Post = ({getpost,post:{post,loading},match}) =>
{
    const {id} =useParams();
    useEffect(()=>{
   getpost(id);
    },[getpost])
  return loading || post ===null ? <Spin/> :<Fragment>
    <Link to="/posts" className='btn'>
        Back To Posts
    </Link>
    <PostItem post={post} showActions={false}/>
    <CommentForm postId={post._id}/>
    <div className='comments'>
        {post.comments.map((comment)=>(
         <CommentItem key={comment._id} comment={comment} postId={post._id}/>
        ))}
    </div>
  </Fragment>
}

Post.propTypes = {
getpost:PropTypes.func.isRequired,
post:PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    post:state.post
})

export default connect(mapStateToProps,{getpost})(Post)
