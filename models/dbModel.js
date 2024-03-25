const mongoose = require('mongoose');

let schema=new  mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    phoneNumber:{
        type:Number
    },
    password:{
        type:String
    },
})

const empModel=mongoose.model( 'employee',schema);
module.exports=empModel;