const mongoose=require("mongoose");
function DBConnect(){
    mongoose.connect("mongodb+srv://karunya:Karu_9976@cluster0.xkaadmc.mongodb.net/BidDB?retryWrites=true&w=majority&appName=Cluster0",{
        useNewUrlParser:true
    }).then((conn)=>{
        console.log("Connected to DB");
    }).catch((err)=>{
        console.log("error in DB");
    })                    
}
module.exports=DBConnect;
                    
