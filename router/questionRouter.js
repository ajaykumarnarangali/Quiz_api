const router=require('express').Router();
const questionController=require('../controllers/questionController');
const {verify}=require('../utils/verify');

//get questions in a quiz
router.get('/:quizId',verify,questionController.getQuestions);

//add question to a quiz
router.post('/add-question',verify,questionController.addQuestion);

//edit question who add the question
router.put('/edit-question/:id',verify,questionController.editQuestion);

//detele question who add the question
router.delete('/:id',verify,questionController.deleteQuestion);


module.exports=router