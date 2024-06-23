const router=require('express').Router();
const authController=require('../controllers/authController');

//user registration
router.post('/sign-up',authController.SignUp);

//user login
router.post('/sign-in',authController.SignIn);


module.exports=router;