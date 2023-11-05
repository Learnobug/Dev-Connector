

const express= require('express');
const router =express.Router();
const auth=require('../../middleware/auth');
const Profile=require('../../models/Profile')
const User=require('../../models/User')
const {check,validationResult}=require('express-validator');
const Post =require("../../models/Post")



router.get('/',async(req,res)=>{
  try{
     const profile=await Profile.find().populate('user',['name','avatar']);
     return res.status(200).json(profile)
  }
  catch(err)
  {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

//@route  GET api/profile/me
//@desc   GET current users profile
//@access Private

router.get('/me',auth,async(req,res)=>{
  try{
        const profile= await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
         
        if(!profile)
        {
           return res.status(400).json({msg:'there is no profile'});
        }
         return res.status(200).json(profile)
  }catch(err)
  {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})


// @route  Post api/profile
// @desc   CREATE OR UPDATE users profile
// @access Private

router.post('/',[auth,
  check('status','status is required').not().isEmpty(),
  check('skills','skills is required').not().isEmpty(),
],async (req,res)=>{
  const errors= validationResult(req);
  if(!errors.isEmpty())
  {
    return res.status(400).json({errors:errors.array()});
  }
   console.log("debug1");
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  }=req.body;
  

  //build profile object
  const profileFields={};
  profileFields.user=req.user.id;
 
  if(company) profileFields.company=company;
  if(website) profileFields.website=website;
  if(location) profileFields.location=location;
  if(bio) profileFields.bio=bio;
  if(status) profileFields.status=status;
  if(githubusername) profileFields.githubusername=githubusername;
  if(skills)
  {
    profileFields.skills=skills.split(',').map(skill => skill.trim());
  }
  console.log("debug2");
  profileFields.social={};
  if(youtube)  profileFields.social.youtube=youtube;
  if(twitter)  profileFields.social.twitter=twitter;
  if(facebook)  profileFields.social.facebook=facebook;
  if(linkedin)  profileFields.social.linkedin=linkedin;
  if(instagram)  profileFields.social.instagram=instagram;


   try{
   
       let profile=await Profile.findOne({user:req.user.id});
       
     
       if(profile)
       {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true, upsert: true }
        );        
      
        return res.json(profile);
      }
      //new profile
  
      profile=new Profile(profileFields);
 
      await profile.save();

      res.json(profile);
   
   }
   catch(err)
   {
    console.error(err.message);
    res.status(500).send('Server Error');
   }

})

//@route  GET api/profile/user/:user_id
//@desc   GET profile by user id
//@access Public

router.get('/:user_id',auth,async(req,res)=>{
  try{
        const profile= await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
         
        if(!profile)
        {
           return res.status(400).json({msg:'there is no profile'});
        }
          res.json(profile);
  }catch(err)
  {
    console.error(err.message);
    if(err.kind == 'ObjectId')
    {
      return res.status(400).json({msg:'Profile not found'})
    }
    res.status(500).send('Server Error');
  }
})


//@route  Delete api/profile
//@desc   delete profile ,user &posts
//@access Private

router.delete('/',auth,async(req,res)=>{
  try{
         //@todo -remove user posts
         await Post.deleteMany({user:req.user.id});
         //remove profile
        console.log("!");
        await Profile.findOneAndRemove({user:req.user.id});
        await User.findOneAndRemove({_id:req.user.id});
       
         res.json({msg:"user removed"})

  }catch(err)
  {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

//@route  PUT api/profile/experince
//@desc   add(update) Profile experince
//@access Private

router.put('/experince',[auth,
  check('title','title is empty').not().isEmpty(),
  check('company','company is required').not().isEmpty(),
  check('from','form date required').not().isEmpty()],async(req,res)=>{
  try{
    
    const errors= validationResult(req);
    if(!errors.isEmpty())
    {
      return res.status(400).json({errors:errors.array()});
    }
      const {
        
        title,
        company,
        loaction,
        from,
        to,
        current,
        description,
      }=req.body;
      console.log("debug-b");
      const newExp={
        title,
        company,
        loaction,
        from,
        to,
        current,
        description,
      }
       try{
    
       const profile=await Profile.findOne({user:req.user.id});

       profile.experience.unshift(newExp);
 
       await profile.save();
   
       res.json(profile);
    
  }
  catch(err)
  {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
catch(err)
  {
    console.error(err.message);
    res.status(500).send('Server Error');
  }});


//@route  DELETE api/profile/experince/:exp_id
//@desc   Delete experince from profile
//@access Private

router.delete('/experience/:exp_id',auth,async(req,res)=>{
  try{
        const profile= await Profile.findOne({user:req.user.id});
         
         const removeIndex=profile.experience.map(item => item.id).indexOf(req.params.exp_id);
         profile.experience.splice(removeIndex,1);
            await profile.save();
         res.json(profile);
  }catch(err)
  {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})


router.put('/education',[auth,
  check('school','school is empty').not().isEmpty(),
  check('degree','degree is required').not().isEmpty(),
  check('from','form date required').not().isEmpty()],async(req,res)=>{
  try{
    
    const errors= validationResult(req);
    if(!errors.isEmpty())
    {
      return res.status(400).json({errors:errors.array()});
    }
      const {
        
        school,
        degree,
         fieldofstudy,
        from,
        to,
        current,
        description,
      }=req.body;
      console.log("debug-b");
      const newExp={
        school,
        degree,
         fieldofstudy,
        from,
        to,
        current,
        description,
      }
       try{
    
       const profile=await Profile.findOne({user:req.user.id});

       profile.education.unshift(newExp);
 
       await profile.save();
   
       res.json(profile);
    
  }
  catch(err)
  {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
catch(err)
  {
    console.error(err.message);
    res.status(500).send('Server Error');
  }});

//delete education with id

  router.delete('/education/:edu_id',auth,async(req,res)=>{
    try{
          const profile= await Profile.findOne({user:req.user.id});
           const removeIndex=profile.education.map(item => item.id).indexOf(req.params.edu_id);
           profile.education.splice(removeIndex,1);
              await profile.save();
           res.json(profile);
    }catch(err)
    {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  })
  

module.exports = router;