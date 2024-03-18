const mongoose=require("mongoose");
const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email:{
      type:String,
      require:true,
      unique:true
    },
    password: String,
    savedPro:[{type:mongoose.Schema.Types.ObjectId,ref:"Bidschema"}],
    mybid: [{
      proId: { type: mongoose.Schema.Types.ObjectId, ref: "Bidschema" },
      amount: Number
  }]
  });
//any name ,collection name,schema name
const User=mongoose.model("User",userSchema);
module.exports=User;