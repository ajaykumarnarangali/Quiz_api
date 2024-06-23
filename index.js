const express=require('express');
const app=express();
const cors=require('cors');
const cookieParser=require('cookie-parser');
require('dotenv').config();
const {connection}=require('./database/connection');

const authRouter=require('./router/authRouter');
const quizRouter=require('./router/quizRouter');
const questionRouter=require('./router/questionRouter');
const responseRouter=require('./router/responseRouter');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


app.use('/api/auth',authRouter);
app.use('/api/quiz',quizRouter);
app.use('/api/question',questionRouter);
app.use('/api/response',responseRouter);

app.use((error,req,res,next)=>{
    res.status(error.status|500).json({
        success:false,
        message:error.message
    })
})

connection();
const PORT=3000 || process.env.PORT
app.listen(PORT,()=>{
    console.log("server running successfully");
})







