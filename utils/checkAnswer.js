const Question = require('../models/questionModel');

module.exports.checkAnswer = async (questionId,selectedOption) => {
    const data = await Question.findById(questionId).select("options");
    const result = data.options.find((each) => each.text == selectedOption);
    return result.isCorrect;
}

module.exports.totalQuestions=async(quizId)=>{
    const total=await Question.countDocuments({quizId});
    return total
}