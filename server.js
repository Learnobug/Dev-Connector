const express=require('express');
const connectDB=require('./config/db');
const cors = require('cors');
const path=require('path')

const app=express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json()); 
connectDB();
app.use(express.json({extended:false}));
const PORT=process.env.PORT||5000;

app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/posts',require('./routes/api/post'));

//serve static assets in producation
if(process.env.NODE_ENV === 'production')
{
    app.use(express.static('client/build'));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client' , 'build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`);
})

  