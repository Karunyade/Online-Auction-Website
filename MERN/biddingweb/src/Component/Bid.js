import { useState, useEffect } from "react";
import "./Bid.css";
import axios from 'axios';

function Bid(props) {
    const [savedpro, setSavedpro] = useState([]);
    const [bidamount, setBidamount] = useState({});

    useEffect(() => {
        const fetchsavedpro = async () => {
            try {
                const email = localStorage.getItem('email');
                const res = await axios.get(`http://127.0.0.1:4000/saved/${email}`);
                setSavedpro(res.data.savedPro);
            } catch (error) {
                console.log("error in fetch saved product", error);
            }
        };
        fetchsavedpro();
    }, []);

   

    const savePro = async (proId) => {
        try {
            const email = localStorage.getItem('email');
            const res = await axios.put("http://127.0.0.1:4000/savetocart", {
                proId,
                email
            });
            setSavedpro(res.data.savePro);
            alert("Your product is saved. Check your Wishlist.");
        } catch (error) {
            console.log("error in save product", error);
        }
    };

    const alsave = (id) => savedpro && savedpro.includes(id);

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
                }
            } else {
                alert("Please enter a valid number in the bid amount field.");
            }
        } catch (error) {
            console.log("error in placing bid:", error);
        }
    };

    const handleBidAmountChange = (proId, value) => {
        setBidamount(prevState => ({
            ...prevState,
            [proId]: value
        }));
    };

    return (
        <div className="bid-container">
            {props.pro.map((s) => (
                <div className="bid-item" key={s._id}>
                    <div className="image-container">
                        <img src={`http://127.0.0.1:4000/${s.pimage}`} alt={s.product_name} />
                    </div>
                    <div className="details-container">
                        <p><b>Product Name:</b> {s.product_name}</p>
                        <p><b>Category:</b> {s.category_name}</p>
                        <p><b>Base Bidding:</b> {s.base_bid}</p>
                        <p className="be"><b>Bidding End Date:</b> {s.bid_end}</p>

                        <button className="btn btn-warning" onClick={() => placeBid(s._id)}>Place Bid</button>

                        <input id="ubid" type="text" placeholder="Enter Bid Amount"
                            className="bid-input" value={bidamount[s._id] || ""} onChange={(e) => handleBidAmountChange(s._id, e.target.value)} /><br />

                        <button className="btn btn-info"
                            onClick={() => savePro(s._id)}
                            disabled={alsave(s._id)}>{alsave(s._id) ? "Saved" : "Add To WishList"}</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Bid;
