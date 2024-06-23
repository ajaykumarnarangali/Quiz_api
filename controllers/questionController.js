const Question = require('../models/questionModel');
const { errorHandler } = require('../utils/errorHandler');

module.exports.addQuestion=async(req,res,next)=>{
    try {
        const {question,optionA,optionB,optionC,optionD,quizId}=req.body;

        if(!question || !optionA || !optionB || !optionC || !optionD || !quizId){
            return next(errorHandler(401,"enter all the fields"));
        }

        const newQuestion=new Question({
            quizId,
            question,
            options:[optionA,optionB,optionC,optionD]
        });
        await newQuestion.save();

        res.status(200).json({message:"question created successfully",question:newQuestion});
        
    } catch (error) {
        next(error);
    }
}

module.exports.editQuestion=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const userId=req.user.id;

        const isQuestionExists=await Question.findById(id).populate("quizId");
        if(!isQuestionExists){
            return next(errorHandler(401,"no question found"));
        }

        if(isQuestionExists.quizId.userId.toString()!==userId){
            return next(errorHandler(401,"only owner can delete question"))
        }

        const {question,optionA,optionB,optionC,optionD,quizId}=req.body;

        if(!question || !optionA || !optionB || !optionC || !optionD || !quizId){
            return next(errorHandler(401,"enter all the fields"));
        }

        isQuestionExists.question=question;
        isQuestionExists.options=[optionA,optionB,optionC,optionD];
        await isQuestionExists.save();

        res.status(200).json({message:"question updated successfully",question:isQuestionExists});
        
    } catch (error) {
        next(error);
    }
}

module.exports.deleteQuestion=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const userId=req.user.id;

        const isQuestionExists=await Question.findById(id).populate("quizId");
        if(!isQuestionExists){
            return next(errorHandler(401,"no question found"));
        }
    
        if(isQuestionExists.quizId.userId.toString()!==userId){
            return next(errorHandler(401,"only owner can delete question"))
        }

        await isQuestionExists.deleteOne();

        res.status(200).json({message:"question deleted successfully"});

    } catch (error) {
        next(error);
    }
}

module.exports.getQuestions=async(req,res,next)=>{
    try {
        const {quizId}=req.params;

        const Questions=await Question.find({quizId}).select("question quizId options.text");

        res.status(200).json({Questions});
        
    } catch (error) {
        next(error)
    }
}