const Response = require('../models/responseModel');
const { errorHandler } = require('../utils/errorHandler');
const { checkAnswer } = require('../utils/checkAnswer');
const { totalQuestions } = require('../utils/checkAnswer');

module.exports.addResponse = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { quizId, questionId, selectedOption } = req.body;

        if (!quizId || !questionId || !selectedOption) {
            return next(errorHandler(401, "enter all the fields"));
        }

        //checking already have response or not 
        const isalreadyRespond = await Response.findOne({ userId, quizId });

        //if there is not response create new one
        if (!isalreadyRespond) {
            const response = new Response({
                userId,
                quizId,
                response: [{ questionId, selectedOption }]
            })
            await response.save();
            const message = await checkAnswer(questionId, selectedOption) ? "answer is correct" : "answer is incorrect";
            return res.status(200).json({ message });
        }
        const message = await checkAnswer(questionId, selectedOption) ? "answer is correct" : "answer is incorrect";

        //checking already attended the question or not
        const { response } = await Response.findOne({ userId, quizId }).select("response");
        const isQuestionAttended = response.some((question) => question.questionId.toString() == questionId);

        //if question is not attended then added to response
        if (!isQuestionAttended) {
            isalreadyRespond.response.push({ questionId, selectedOption });
            await isalreadyRespond.save();

            return res.status(200).json({ message })
        }

        res.status(200).json({ message: "question already attended" });

    } catch (error) {
        console.log(error)
        next(error);
    }
}

module.exports.getResult = async (req, res, next) => {
    try {

        const userId = req.user.id;
        const { quizId } = req.body;

        const total_Qns = await totalQuestions(quizId);
        let correct_Ans = 0;

        const { response } = await Response.findOne({ userId, quizId }).populate("response.questionId", "-_id -quizId").select("response -_id");
        const attended_Qns = response.length;
        response.forEach(each => {
            const question = each.questionId;
            const selectedOption = each.selectedOption;

            const matchedOption = question.options.find(option => option.text === selectedOption);
            if (matchedOption && matchedOption.isCorrect) {
                correct_Ans++;
            }
        });

        res.status(200).json({
            totalQuestions:total_Qns,
            attendedQuestions:attended_Qns,
            correctAnwers:correct_Ans,
            userResponse:response
        })
       
    } catch (error) {
        next(error)
    }
}

module.exports.getSingleQunResult=async(req,res,next)=>{
    try {
        const userId=req.user.id;
        const { quizId,questionId } = req.body;

        const { response } = await Response.findOne({ userId, quizId }).populate("response.questionId", "-quizId").select("response -_id");

        const currentQuestion=response.find((each)=>each.questionId._id==questionId);

        const selectedOption=currentQuestion?.selectedOption;
        const options=currentQuestion?.questionId?.options;
        const result=options.find((each)=>each.text==selectedOption);

        res.send({message:result.isCorrect?"answer is correct":"answer is incorrect"});
 
    } catch (error) {
        next(error);
    }
}