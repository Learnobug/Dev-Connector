const express=require('express');
const router=express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const {check,validationResult} =require("express-validator")
const bcrypt=require('bcryptjs')
const config=require('config')
 const jwt= require('jsonwebtoken')

// get users
router.get('/',auth,async (req,res)=>{
    try{
          const user=await User.findById(req.user.id).select('-password');
            res.json(user);
    }
    catch(err)
    {
     console.error(err.message);
     res.status(500).send('Server Error');
    }
});


// authenticate and login user
router.post('/',[
    check('email','Please include valid email').isEmail(),
    check('password','password required').exists()
],async (req,res)=> {
     const errors=validationResult(req);
     if(!errors.isEmpty())
     {
        return res.status(400).json({errors:errors.array()});
     }
     const {email,password}=req.body;
        try {
            let user = await User.findOne({ email })

     //see if user exists
     if (!user) {
        return res.status(400).json({ errors: [{ msg: 'email not exist' }]});
    }


    const ismatch=await bcrypt.compare(password,user.password);
  
    if(!ismatch)
    {
        return res.status(400).json({ errors: [{ msg: 'password is wrong' }]});   
    }
   //return jsonweb token

     const payload={
        user:{
            id:user.id
        }
     };
     jwt.sign(payload,config.get('jwtSecret'),{expiresIn:360000},(err,token)=>{
         if(err) throw err;
         return res.json({token});
     });
        } catch (err){
         console.error(err.message);
         res.status(500).send('server error');
        }
});
module.exports=router;
