class CustomAPIError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode=statusCode
    }
}
const createCustomError = (msg,statuscode)=>{
    return new CustomAPIError(msg, statuscode)
}

module.exports = {createCustomError, CustomAPIError}