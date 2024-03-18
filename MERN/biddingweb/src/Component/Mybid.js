import { useState ,useEffect} from "react";
import axios from 'axios';
function Mybid(){
   
    //storing my bid in state
    const [sbid, setSbid] = useState([]);
    //for each state bid amount 
    const [bidamount,setBidamount]=useState({});
    const [mybid, setMyBid] = useState([]); // State to hold the response from placeBid
  


    //fetching bidded product
   useEffect(()=>{
    const userbid= async()=>{
        try{
            const email=localStorage.getItem("email");
            const response = await axios.get(`http://127.0.0.1:4000/mybid/${email}`);
            setSbid(response.data);
        }catch(error){
            console.log("error in user mybid")
        }
    };
    userbid();
   },[])
    
//fetching user my bid to dispaly button
   useEffect(()=>{
    const mbid=async()=>{
     try{
       const email=localStorage.getItem("email");
       console.log(email)
       const response= await axios.get(`http://127.0.0.1:4000/mbid/${email}`)
       setMyBid(response.data.mbid.map(item => ({ proId: item.proId, amount: item.amount })));
     }catch(error)
     {
      console.log("error in  getting user mybid ")
     }
 }
 mbid();
    },[])
    
    
    console.log(`${JSON.stringify(mybid)} mybid`); 
// bidding
   const placeBid = async (proId) => {
    try {
        const email = localStorage.getItem('email');
        const currentBid = bidamount[proId];
        //console.log(proId);
        if (!isNaN(currentBid)) {
            const res = await axios.patch(`http://127.0.0.1:4000/probid/${email}`, {
                proId,
                bidamount: currentBid
            });
            if (res.data.message === "Invalid email") {
                alert("You posted this post so you cannot bid");
            } else if (res.data.message === "Bid amount must be greater than current base bid") {
                alert("Bid amount must be greater than current base bid");
            } else if (res.data.message === "Bid amount updated successfully") {
                alert("You Bidded for this product");
                window.location.reload();
            }
        } else {
            alert("Please enter a valid number in the bid amount field.");
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

const checkBidConditions = (s) => {
    return new Date() > new Date(s.bid_end) && s.userbid.email === localStorage.getItem('email');
};

    return(
         <div className="bid-container">
            {sbid.length > 0 && sbid.map((s) => {
                const myBidAmountObj = mybid.find(item => item.proId === s._id);
                const myBidAmount = myBidAmountObj ? myBidAmountObj.amount : 0;  
                const buttonClass = s.base_bid > myBidAmount ? "btn btn-danger":"btn btn-success" ;  
                const isBidConditionMet = checkBidConditions(s);
                console.log(s.userbid.email);

                return (
                    <div className="bid-item" key={s._id}>
                        <div className="image-container">
                            <img src={`http://127.0.0.1:4000/${s.pimage}`} alt={s.product_name} />
                        </div>
                        <div className="details-container">
                            <p><b>Product Name:</b> {s.product_name}</p>
                            <p><b>Category:</b> {s.category_name}</p>
                            <p><b>Base Bidding:</b> {s.base_bid}</p>
                            <p className="be"><b>Bidding End Date:</b> {s.bid_end}</p>
                            <p><b>MY last bid:</b>{myBidAmount}</p>
                            {isBidConditionMet ? (
                                <button className="btn btn-primary" disabled>You won the bid</button>
                            ) : (
                                <>
                                    <button className={buttonClass} onClick={() => placeBid(s._id)}>
                                        {s.base_bid > myBidAmount ? "Place bid" : "Safe"}
                                    </button>
                                    <input id="ubid" type="text" placeholder="Enter Bid Amount"
                                        className="bid-input" value={bidamount[s._id] || ""}
                                        onChange={(e) => handleBidAmountChange(s._id, e.target.value)} />
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
    
}
export default Mybid;