import { useState ,useEffect} from "react";
import axios from 'axios';
function WishList(){
   
    const [savedpro,setSavedpro]=useState([]);
    const [bidamount,setBidamount]=useState("");

    useEffect(()=>{
      const fetchsavedpro=async()=>{
        try{
          const email=localStorage.getItem('email');
         const res=await axios.get(`http://127.0.0.1:4000/wishlist/${email}`)
         setSavedpro(res.data)
         //console.log(res.data);
        }catch(error){
          console.log("error in fetch saved product")
        }
      };
      fetchsavedpro();
  },[]);

   
   //user place bid check user amount greater that base bid   PENDING
   const placeBid = async (proId) => {
    try {
      const email = localStorage.getItem('email');
      const currentBid = bidamount[proId];
      if (!isNaN(currentBid)) {
        console.log(email);
        console.log(currentBid); // Log the parsed bid amount
        console.log(proId);
      } else {
        alert("Please enter a valid number in the bid amount field.");
        return;
      }
      const res = await axios.patch(`http://127.0.0.1:4000/probid/${email}`, {
          proId,
          bidamount:currentBid
      });
      console.log(res);
        if(res.data.message === "Invalid email")
        {
          alert("You posted this post so you cannot bid");
        }
        else if (res.data.message === "Bid amount must be greater than current base bid") 
        {
          alert("Bid amount must be greater than current base bid");
        }
        else if(res.data.message === "Bid amount updated successfully"){
          alert("You Bidded for this product");
        }
    } catch (error) {
        console.log("error in placing bid:", error);
    }
};

//for each product input field
const handleBidAmountChange = (proId, value) => {
    setBidamount(prevState => ({
        ...prevState,
        [proId]: value // Update the bid amount for the corresponding product
    }));
  };

    return(
        <div className="bid-container">
        {savedpro.map((s) => {
          return (
            <div className="bid-item" key={s._id}>
              <div className="image-container">
                <img src={`http://127.0.0.1:4000/${s.pimage}`} alt={s.product_name} />
              </div>
              <div className="details-container">
                <p><b>Product Name:</b> {s.product_name}</p>
                <p><b>Category:</b> {s.category_name}</p>
                <p><b>Base Bidding:</b> {s.base_bid}</p>
                <p class="be"><b>Bidding End Date:</b> {s.bid_end}</p>
                <button className="btn btn-warning" onClick={() => placeBid(s._id)}>Place Bid</button>
                <input id="ubid" type="text" placeholder="Enter Bid Amount" 
                className="bid-input" value={bidamount[s._id] || ""}  onChange={(e) => handleBidAmountChange(s._id, e.target.value)}/><br/>


              </div>
            </div>
          );
        })}
      </div>
    )
}
export default WishList;