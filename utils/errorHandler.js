module.exports.errorHandler=(code,message)=>{
    const error = new Error();
    error.message = message;
    error.status = code;
    return error;
}