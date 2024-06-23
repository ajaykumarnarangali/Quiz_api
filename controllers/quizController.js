const Quiz = require('../models/quizModel');
const Question=require('../models/questionModel');
const Response=require('../models/responseModel');
const { errorHandler } = require('../utils/errorHandler');


module.exports.addQuiz = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;

        if (!title) {
            return next(errorHandler(401, "enter all the fields"));
        }

        const newQuiz = new Quiz({
            title,
            description,
            userId
        })

        await newQuiz.save();

        res.status(200).json({ message: "quiz created successfully", quiz: newQuiz });

    } catch (error) {
        console.log(error)
        next(error);
    }
}

module.exports.editQuiz = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId=req.user.id

        const isExist = await Quiz.findById(id);
        if (!isExist) {
            return next(errorHandler(401, "quiz not found"));
        }

        if(isExist.userId.toString()!==userId){
           return next(errorHandler(401,"you can only edit your quiz"))
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(id, {
            $set: {
                title: req.body.title,
                description: req.body.description
            }
        }, { new: true })

        res.status(200).json({ message: "quiz created successfully", quiz: updatedQuiz });

    } catch (error) {
        console.log(error)
        next(error);
    }
}

module.exports.getAllQuiz = async (req, res, next) => {
    try {

        const AllQuiz = await Quiz.find();
        res.status(200).json({ quizes: AllQuiz });

    } catch (error) {
        next(error);
    }
}
module.exports.getSingleQuiz = async (req, res, next) => {
    try {
        const {id}=req.params
        const AllQuiz = await Quiz.findById(id);
        res.status(200).json({ quizes: AllQuiz });

    } catch (error) {
        next(error);
    }
}

module.exports.deleteQuiz=async(req,res,next)=>{
    try {
        const id = req.params.id;
        const userId=req.user.id;

        const isExist = await Quiz.findById(id);
        if (!isExist) {
            return next(errorHandler(401, "quiz not found"));
        }

        if(isExist.userId.toString()!==userId){
           return next(errorHandler(401,"you can only edit your quiz"))
        }

        await isExist.deleteOne();
        await Question.deleteMany({quizId:id});
        await Response.deleteOne({userId,quizId:id});

        res.status(200).json({message:"quiz and questions are deleted",success:true});
        
    } catch (error) {
        next(error);
    }
}