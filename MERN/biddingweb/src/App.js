import axios from "axios"
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Content from "./Component/Content";
import { useEffect, useState } from "react";
function App()
{
    //all usestate and useeffect
    const [bidpro,setpro]=useState([])
    const [sprostore,setcstore]=useState([])
    useEffect(()=>{
        getallpro();
    },[])
   

    //get all product from DB
    const getallpro=async()=>{
        const res=await axios.get("http://127.0.0.1:4000/activelis")
       // console.log(res.data.allproduct);
        setpro(res.data.allproduct);  
    }
   

    // serch category and display in frontend
    const sprocat=async (category)=>{
        //console.log(category);
        try{
            const res=await axios.get(`http://127.0.0.1:4000/category/${category}`)
            //console.log(res.data);
            setcstore(res.data);
        }
        catch(error){
            console.log("erroe in catproduct")
        }
    }
    //console.log(sprostore);

  
    //posting data from frontend to database
    console.log(bidpro)
    const insertToDB=async (products,file)=>{
        let formdata=new FormData();
        formdata.append("file",file)
        const res=await axios.post("http://127.0.0.1:4000/create",products)
        console.log(res)
        const res1=await axios.post("http://127.0.0.1:4000/create/upload",formdata)
        getallpro();
        alert("sucessfully added your product for bidding")
    }
    return(
        <div>
            <Header pro={bidpro} insertToDB={insertToDB} sprocat={sprocat} cproduct={sprostore}></Header>
            
        </div>
    )
}
export default App;