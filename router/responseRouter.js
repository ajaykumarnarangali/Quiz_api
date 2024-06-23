const router=require('express').Router();
const responseController=require('../controllers/responseController');
const {verify}=require('../utils/verify');

//submit question
router.post('/',verify,responseController.addResponse);

//get result of quiz
router.get('/result',verify,responseController.getResult);

//get result of single question
router.get('/single-question',verify,responseController.getSingleQunResult)


module.exports=router;