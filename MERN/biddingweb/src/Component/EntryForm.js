import React,{useState} from 'react';
import './EntryForm.css'
function EntryForm(props){
   let [pName,setPName]=useState('')
   let [pCat,setC]=useState('')
   let [pBid,setPBid]=useState('')
   let [pEnd,setPEnd]=useState('')
   let [pImageFile,setPImageFile]=useState([]);
   let [pImage,setPImage]=useState([]);
   function proNameHandle(event){
     setPName(event.target.value)
   }
   function proCatHandle(event){
     setC(event.target.value)
   }
   function proBidHandle(event){
     setPBid(event.target.value)
   }
   function proEndHandle(event){
     setPEnd(event.target.value)
   }
   function pImageHandle(event){
    setPImageFile(event.target.files[0])
    setPImage(event.target.value)
   }
   function saveBidpro(event)
   {
      event.preventDefault();
      const userEmail=localStorage.getItem('email')
      //valid bid amount
      if (parseFloat(pBid) < 0) {
        alert('Base bid amount cannot be less than 0');
        return; // Stop further execution
      }

       // Validate end date
      const selectedEndDate = new Date(pEnd);
      const currentDate = new Date();
      if (selectedEndDate < currentDate) {
          alert('Please choose a future date for the end bid');
          return; // Stop further execution
      }
      let Bpro={
         //database name:noe usestate
         product_name:pName,
         category_name:pCat,
         base_bid:pBid,
         bid_end:pEnd,
         pimage:pName+pImageFile.name,
         email:userEmail
      }
      //console.log(Bpro.pimage);
      props.setBidp(Bpro,pImageFile)
      setPName('');
      setC('');
      setPBid('');
      setPEnd('');
      setPImageFile([]);
      setPImage('');

   }
    return(
    <form onSubmit={saveBidpro}>
        <div className="ef border border-primary  rounded">
            <fieldset>

                <legend>Product Bidding Form</legend>

                <div className="input-group pad">
                  <span className="input-group-text">Product Name</span>
                  <input type="text" aria-label="Product Name"
                  id='pName'
                  value={pName}
                  onChange={proNameHandle}/>
                </div>


                <div className="input-group pad">
                <span className="input-group-text">Category</span>
                <select aria-label="Category" id='pCat' value={pCat} onChange={proCatHandle}>
                    <option value="">Select Category</option>
                    <option value="dress">Dress</option>
                    <option value="electronics">Electronics</option>
                    <option value="vehicles">Vehicles</option>
                    <option value="stationery">stationery</option>
                    <option value="school">School & college</option>
                    <option value="miscellaneous">miscellaneous</option>
                </select>
                </div>

                 <div className="input-group pad">
                    <span className="input-group-text">Base Bid Amount</span>
                    <input type="text" aria-label="Base bid"
                     id='pBid'
                     value={pBid}
                     onChange={proBidHandle}/>
                 </div>

                 <div className="input-group pad">
                    <span className="input-group-text">End Date</span>
                    <input type="date" aria-label="End bid"
                     id='pEnd'
                     value={pEnd}
                     onChange={proEndHandle}/>
                 </div>

                 <div className="input-group pad">
                    <span className="input-group-text">Product Photo</span>
                    <input type="file" aria-label="Product photo"
                    id='pImage'
                    value={pImage}
                    onChange={pImageHandle}/>
                 </div>

                 <div className="btdiv">
                   <button className="btn btn-primary me-md-2" type="clear">Clear</button>
                   <button className="btn btn-primary me-md-2" type="submit">Submit</button>
                 </div>

            </fieldset>
        </div>
  </form>
   
    )
}
export default EntryForm;