const router=require('express').Router();
const { verify } = require('../utils/verify');
const quizController=require('../controllers/quizController');

//add quiz
router.post('/add-quiz',verify,quizController.addQuiz);

//edit quiz who add the quiz
router.put('/edit-quiz/:id',verify,quizController.editQuiz);

//get all quiz
router.get('/all',quizController.getAllQuiz);

//get single quiz
router.get('/each/:id',quizController.getSingleQuiz);

//delete quiz and questions who add the quiz
router.delete('/:id',verify,quizController.deleteQuiz);

module.exports=router;