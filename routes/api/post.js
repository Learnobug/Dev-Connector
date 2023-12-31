const express = require('express');
const router = express.Router();
const {check,validationResult}=require('express-validator')
const auth=require('../../middleware/auth')
const Post=require('../../models/Post');
const Profile=require('../../models/Profile');
const User=require('../../models/User');
// @route   POST api/posts
// @desc    create a post
// @access  Private
router.post('/',[auth,[check('text','text is required').not().isEmpty(),
]] ,async (req, res) => {
   const errors=validationResult(req);
   if(!errors.isEmpty())
   {
     return res.status(400).json({errors:errors.array()});
   }

   try{
    const user= await User.findById(req.user.id).select('-password');
    const newpost=new Post({
     text:req.body.text,
     name:user.name,
     avatar:user.avatar,
     user:req.user.id,
    })
    const post = await newpost.save();
    res.json(post);
   }
   catch(err)
   {
    console.error(err.message);
    res.status(500).send('server error');
   }

  
});

// @route   GET api/posts
// @desc    get all post
// @access  Public


router.get('/',async(req,res)=>{
    try{
     const  posts=await Post.find().sort({date:-1});
     res.json(posts);
    }
    catch(err)
    {
     console.error(err.message);
     res.status(500).send('server error');
    }
})

// @route   GET api/posts/:id
// @desc    get  post by id
// @access  Private


router.get('/:id',auth,async(req,res)=>{
    try{
     const  post=await Post.findById(req.params.id);
     if(!post)
     {
        res.status(404).json({msg:'post not found'});
     }
     res.json(post);
    }
    catch(err)
    {
     console.error(err.message);
     if(err.kind==='ObjectId')
     {
        res.status(404).json({msg:'post not found'});
     }
     res.status(500).send('server error');
    }
})

// @route   DELETE api/posts/:id
// @desc    delete a post by id
// @access  Private


router.delete('/:id',auth,async(req,res)=>{
    try{
     const post=await Post.findById(req.params.id);
     console.log(post);

     if(!post)
     {
        res.status(404).json({msg:'post not found'});
     }

     if(post.user.toString()!==req.user.id)
     {
        res.status(401).json({msg:'user not authorised'});
     }
     await Post.deleteOne({ _id: req.params.id });
     res.json({msg:"post is removed"})
    }
    catch(err)
    {
     console.error(err.message);
     res.status(500).send('server error');
    }
})

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private

router.put('/like/:id',auth,async(req,res) =>{
    try{
      const post= await Post.findById(req.params.id);
      //check if the post has already liked
      if(post.likes.filter(like=> like.user.toString()===req.user.id).length>0)
      {
        return res.status(400).json({msg:'post already liked'});
      }
      post.likes.unshift({user:req.user.id});
      await post.save();
      res.json(post.likes);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send('server error');
    }
})

// @route   PUT api/posts/unlike/:id
// @desc    Like a post
// @access  Private

router.put('/unlike/:id',auth,async(req,res) =>{
    try{
      const post= await Post.findById(req.params.id);
      //check if the post has already liked
      if(post.likes.filter(like=> like.user.toString()===req.user.id).length===0)
      {
        return res.status(400).json({msg:'post has not yet been liked'});
      }
     //get remove index
     const removeIndex=post.likes.map(like => like.user.toString().indexOf(req.user.id));

     post.likes.splice(removeIndex,1);
      await post.save();
      res.json(post.likes);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send('server error');
    }
})

// @route   POST api/posts/comment/:id
// @desc    comment on a post
// @access  Private
router.post('/comment/:id',[auth,[check('text','text is required').not().isEmpty(),
]] ,async (req, res) => {
   const errors=validationResult(req);
   if(!errors.isEmpty())
   {
     return res.status(400).json({errors:errors.array()});
   }

   try{
    const user= await User.findById(req.user.id).select('-password');
    const post=await Post.findById(req.params.id);
    const newComment={
     text:req.body.text,
     name:user.name,
     avatar:user.avatar,
     user:req.user.id,
    }
    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);
   }
   catch(err)
   {
    console.error(err.message);
    res.status(500).send('server error');
   }

  
});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment
// @access  Private
router.delete('/comment/:id/:comment_id',auth ,async (req, res) => {

   try{
     const post =await Post.findById(req.params.id);
     console.log(post);
     //pull out comment
     const comment =post.comments.find(comment => comment.id===req.params.comment_id);
     //make sure comment exists
     console.log(comment);
     if(!comment)
     {
        return res.status(404).json({mgs:"comment does not exist"});
     }

     if(comment.user.toString()!==req.user.id)
     {
        return res.status(401).json({msg:"unauthorised user"})
     }
     const removeIndex=post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

     post.comments.splice(removeIndex,1);
      await post.save();
      res.json(post.comments);

   }
   catch(err)
   {
    console.error(err.message);
    res.status(500).send('server error');
   }


  
});

module.exports = router;
