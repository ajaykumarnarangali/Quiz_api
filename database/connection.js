const mongoose=require('mongoose');

module.exports.connection=async()=>{
    try {
        await mongoose.connect('mongodb://0.0.0.0:27017/Quiz');
        console.log("database connected successfully");
        
    } catch (error) {
        console.log("database connection failed");
    }
}