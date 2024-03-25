const mongoose = require('mongoose');

const connectDB=async()=>{
    let res=await mongoose.connect("mongodb://localhost:27017/authentication")
    if(res){
        console.log("Database Connected Successfully");
    }
}

module.exports=connectDB;