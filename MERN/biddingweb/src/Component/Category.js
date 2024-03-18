import { useState } from "react";
import "./Category.css"
import axios from "axios";

function Category(props) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [bidamount,setBidamount]=useState("");

    function handleSearch() {
        const category = document.getElementById('category').value;
        setSelectedCategory(category);
        props.setCat(category);
    }

    const [savedProducts, setSavedProducts] = useState([]); // Corrected the state name

    const savePro = async (proId) => {
        console.log(proId);
        try {
            const email = localStorage.getItem('email');
            const res = await axios.put("http://127.0.0.1:4000/savetocart", {
                proId,
                email
            });
            setSavedProducts(res.data.savePro); // Corrected setting the state
            alert("your product is saved check you WishList")
        } catch (error) {
            console.log("error in save product");
        }
    };

    const isProductSaved = (id) => savedProducts && savedProducts.includes(id); // Corrected accessing the state

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
    return (
        <div className="catproduct">
            <h1>Select Category For Bidding</h1>
            <label htmlFor="category">Choose a category :</label>
            <select id="category">
                <option value="">Select Category</option>
                <option value="dress">Dress</option>
                <option value="electronics">Electronics</option>
                <option value="vehicles">Vehicles</option>
                <option value="stationery">Stationery</option>
                <option value="school">School & college</option>
                <option value="miscellaneous">Miscellaneous</option>
            </select>
            <button type="button" className="btn btn-primary me-md-2" onClick={handleSearch}>Search</button>
            
            <div className="bid-container">
                {props.cproduct.map((s) => {
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

                                <button className="btn btn-warning" onClick={() => placeBid(s._id)}>Place Bid</button>

                                <input id="ubid" type="text" placeholder="Enter Bid Amount" 
                               className="bid-input" value={bidamount[s._id] || ""}  onChange={(e) => handleBidAmountChange(s._id, e.target.value)}/><br/>


                                <button className="btn btn-info" 
                                    onClick={() => savePro(s._id)}
                                    disabled={isProductSaved(s._id)}>
                                    {isProductSaved(s._id) ? "Saved" :"Add To WishList"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Category;
