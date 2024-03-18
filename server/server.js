const express=require("express");
const DBConnect=require("./DBConnect");
const cors=require("cors")
const app=express();
const route=require("./routing");
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./images"))
app.use(cors())
DBConnect();
const User=require("./Userschema");
// Home
app.get("/",route.getDemo)

//Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check email
    const user = await User.findOne({ email: email });
    if (user) {
      // Check password
      if (password === user.password) {
        res.json(user);
      } else {
        res.send({ message: "Check your Password" });
      }
    } else {
      res.send({ message: "User not found SignIn first" });
    }
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).send({ message: "An error occurred while logging in" });
  }
});



//signup
app.post("/signup", async (req, res) => {
  const { fname, lname, email, password } = req.body;
  try {
    // Check if the user with the provided email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      // If the user already exists, send an error response
      return res.status(400).json({ message: "User is already registered" });
    }

    // If the user doesn't exist, create a new user object
    const newUser = new User({
      fname,
      lname,
      email,
      password,
    });

    // Save the new user to the database
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: "Account has been created!! Please Login" });
  } catch (error) {
    // If an error occurs during the database operation, send an error response
    console.error("Error in signup:", error);
    res.status(500).json({ message: "An error occurred while signing up" });
  }
});





// Active Listining
app.get("/activelis",route.getActive)

// Category
app.get("/category",route.getCat)

//category search
app.get("/category/:search",route.getItems)

// creating product for bidding
app.post("/create",route.Bidproduct)

//upload image
app.post("/create/upload",route.upload.single("file"),route.uploadImg)

//save to cart
app.put("/savetocart",route.savepro)

//to check alredy saved cannot saved
app.get("/saved/:email",route.getAlreadysave)

//to reterive from saved product for each user
app.get("/wishlist/:email",route.getWishlist)

//update user amount if higher
app.patch("/probid/:email", route.updateAmount);

//reterive mybid product  from user
app.get("/mybid/:email",route.getMybid);

//reterive mybid of user
app.get("/mbid/:email",route.getUbid);

app.listen(4000,()=>{
    console.log("Server started")
})