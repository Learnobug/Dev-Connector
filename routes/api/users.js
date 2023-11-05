
const express=require('express')
const router=express.Router();
const gravatar=require('gravatar')
const { check, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs')
const User=require('../../models/User')
const jwt=require('jsonwebtoken');
const config=require('config')


//new user
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please include valid email').isEmail(),
    check('password','Please enter a password 6 or more characters').isLength({min:6})
],async(req,res) =>  {
     const errors=validationResult(req);
     console.log("1");
     if(!errors.isEmpty())
     {
        return res.status(400).json({errors:errors.array()});
     }
     console.log("2");
     const {name,email,password}=req.body;
        try {
            let user = await User.findOne({ email })

     //see if user exists
     if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }]});
    }

     const avatar=gravatar.url(email,{
        s:'200',
        r:'pg',
        d:'mm'
     });
     //new registraion
     console.log("3");
     user=new User({
        name,
        email,
        avatar,
        password
     });

     const salt=await bcrypt.genSalt(10);
     user.password=await bcrypt.hash(password,salt);
     console.log("4");
     await user.save();
     console.log("5");  
     const payload={
        user:{
            id:user.id
        }
     };
     jwt.sign(payload,config.get('jwtSecret'),{expiresIn:360000},(err,token)=>{
         if(err) throw err;
         return res.json({token});
     })
        } catch (err){
         console.error(err.message);
       }
});
module.exports=router;