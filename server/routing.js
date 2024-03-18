const Bidschema=require("./Bidschema")
const User=require("./Userschema")
const multer=require("multer")
let fname=""
function getDemo(req,res){
    res.send("This is a server")
}
const storage=multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,"images")
    },
    filename:(req,res,cb)=>{
        cb(null,fname)
    }
})

exports.upload=multer({
    storage:storage
})
// get all products for bidding
exports.getActive= async(req,res)=>{
   try{
     const allproduct=await Bidschema.find();
     res.status(201).json({
        allproduct
     })
   }
   catch(error){
     console.log("error in all products getting")
   }
}
function getCat(req,res){
    res.send("This is Category")
}


// category from database
exports.getItems=async(req,res)=>{
    const {search}=req.params;
    try{
        const items=await Bidschema.find({category_name:search});
        res.json(items);
    }
    catch(error){
        res.send("error in search category");
    }
}

exports.uploadImg=async(req,res)=>{
    try{
       res.status(201).json({
        // field name and value
         data:"uploaded"
       })
    }
    catch(error){
       res.send("error in scahema");
    }
  
   
}

// creation of bid product
exports.Bidproduct=async(req,res)=>{
    try{
       const products=await Bidschema.create(req.body)
       fname=req.body.pimage;
       //console.log(fname)
       res.status(201).json({
        // field name and value
         data:products
       })
    }
    catch(error){
       res.send("error in scahema");
    }
  
   
}

//to save product
exports.savepro=async(req,res)=>{
    try{
        const addtocart=await Bidschema.findById(req.body.proId);//find the product id in bidschema
        const user=await User.findOne({email:req.body.email});//find which user clicked
        user.savedPro.push(addtocart);//push thet product id in the user saved pro
        await user.save();
        res.status(201).json({
          savedPro:user.savedPro//particular user saved product
        })
     }
     catch(error){
        res.send("error in save to cart");
     }
}

//reterive wishlist
exports.getWishlist=async(req,res)=>{
    const {email}=req.params;
    try{
     const user=await User.findOne({email:email})//find user email in user schema to display product
     const savedp=await  Bidschema.find({
        _id:{ $in:user.savedPro}//searching that the users saved pro id in bidschema and return that 
     })
     res.json(savedp)
    }catch(error){
        res.send("error in getting wishlist")
    }
}

//get id of product of user to check alredy saved cannot saved
exports.getAlreadysave=async(req,res)=>{
    const {email}=req.params;
    try{
        const user=await User.findOne({email:email})
        res.json({savedPro:user?.savedPro})
    }catch(error){
        res.json("error in getting ids of saved")
    }
}


//for updating user amount
exports.updateAmount = async (req, res) => {
    const { email } = req.params;

    try {
        // Destructure request body
        const { proId, bidamount } = req.body;

        // Find the product by ID
        const bidpro = await Bidschema.findById(proId);
        // Find user in the database using email
        const user = await User.findOne({ email: email });

        if (!bidpro) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Check conditions
        if (email !== bidpro.email) {
            if (bidamount > bidpro.base_bid) {
                // Update the fields
                bidpro.base_bid = bidamount;
                // Update userbid subdocument
                bidpro.userbid.email = email;
                bidpro.userbid.amount = bidamount;

                // Save the updated document
                await bidpro.save();

                // Check if the product already exists in the user's mybid array
                const existingBidIndex = user.mybid.findIndex(bid => bid.proId.toString() === bidpro._id.toString());

                if (existingBidIndex !== -1) {
                    // If the product already exists, update only the amount
                    user.mybid[existingBidIndex].amount = bidamount;
                } else {
                    // If the product doesn't exist, push a new object
                    user.mybid.push({ proId: bidpro._id, amount: bidamount });
                }
                await user.save();

                // Prepare the response JSON 
                const response = {
                    message: "Bid amount updated successfully",
                };

                return res.status(200).json(response);
            } else {
                return res.status(200).json({ message: "Bid amount must be greater than current base bid" });
            }
        } else {
            return res.status(200).json({ message: "Invalid email" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getMybid = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const productIds = user.mybid.map(bid => bid.proId); // Extract product IDs from user's bids
        const products = await Bidschema.find({ _id: { $in: productIds } });
        return res.status(200).json(products);
    } catch (error) {
        console.error("Error in fetching user's bids:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getUbid=async (req,res)=>{
    const {email}=req.params;
    try{
        const user=await User.findOne({ email: email});
        res.json({mbid:user.mybid})

    }catch(error){
        console.log("erroe in Ubid");
        res.status(200).json({message:"error in ubid"});
    }
}

exports.getDemo=getDemo;
exports.getCat=getCat;

