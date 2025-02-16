const port = 4000;

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const exp = require('constants');
const { type } = require('os');

app.use(express.json());
app.use(cors(
    {
        origin: 'https://shopper-275du2jle-shubham-ghimires-projects.vercel.app/',
        credentials: true,
        methods: ['GET', 'POST'],
    }
));

// database connection with mongo db
mongoose.connect("mongodb+srv://shubham0011ghimire:Kurenai@cluster0.v5vddt8.mongodb.net/e-commerce");

// API Creation

app.get('/', (req, res) => {
    res.send("Express app is Running");
})

// Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})


const upload = multer({ storage: storage })

// creating upload endpoint for images
app.use('/images', express.static('upload/images'));

app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`,
    })
})


// Schema for creating products 

const Product = mongoose.model('Product', {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    }
})

app.post('/addproduct', async (req, res) => {

    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else {
        id = 1;
    }

    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Product Added");
    res.json({
        success: true,
        name: req.body.name,
    })
});

// creating Api for deleting product
app.post('/deleteproduct', async (req, res) => {
    await Product.findOneAndDelete({
        id: req.body.id,
    })
    console.log("Product Deleted");
    res.json({
        success: true,
        id: `Product ${req.body.name} removed successfully`,
    })
});

// creating Api for getting product
app.get('/allproducts', async (req, res) => {
    const products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Schema creating for user model
const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

// creating Api for user registration
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({
            success: false,
            message: "Email already exists",
        });
    }
    let cart = {};
    for (i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    });

    await user.save();

    const data = {
        user: {
            id: user.id,
        }
    }

    const authToken = jwt.sign(data, 'secret_ecom');
    res.json({
        success: true,
        authToken: authToken,
        message: "User Registered Successfully",
    })
});

// creating Api for user login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });

    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id,
                }
            }
            const authToken = jwt.sign(data, 'secret_ecom');
            res.json({
                success: true,
                authToken: authToken,
                message: "Login Successfull",
            })
        }
        else {
            res.json({
                success: false,
                message: "Invalid  Password",
            })
        }
    }
    else {
        res.json({
            success: false,
            message: "Invalid email",
        })
    }

})

// creating endpoint for new collection data

app.get('/newcollection', async (req, res) => {
    let products = await Product.find({});
    let new_collection = products.slice(1).slice(-8);
    console.log("New Collection Fetched");
    res.send(new_collection);
})

app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({ category: "Women" });
    let popular_in_women = products.slice(0, 4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})

// creating middleware to fetch user data
const fetchUser = async (req, res, next) => {
    const token = req.header('authToken');
    if(!token){
        res.status(401).send({
            errors: "please authenticate using a valid token"
        }
    )
        
    }else{
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({
                errors: "please authenticate using a valid token"
            })
        }
    }
}

// creating endpoint for adding to cart

app.post('/addtocart',fetchUser , async (req, res) => {
    console.log("added",req.body.itemId)
    let userData = await Users.findOne({ _id: req.user.id});
    userData.cartData[req.body.itemId] += 1
    await Users.findOneAndUpdate({ _id: req.user.id}, {cartData: userData.cartData});
    res.send("Item Added to Cart");
})

// creating endpoint for removing from cart
app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("removied",req.body.itemId)
    let userData = await Users.findOne({ _id: req.user.id});
    if(userData.cartData[req.body.itemId] >0)
    userData.cartData[req.body.itemId] -= 1
    await Users.findOneAndUpdate({ _id: req.user.id}, {cartData: userData.cartData});
    res.send("Item removed from Cart");
})

// creating endpoint for getting cart data
app.post('/getcart', fetchUser, async (req, res) => {
    console.log("getting cart data")
    let userData = await Users.findOne({ _id: req.user.id});
    res.json(userData.cartData);
})

// checking for server status
app.listen(port, (error) => {
    if (!error) {
        console.log('Server is running on port ' + port);
    }
    else {
        console.log("Error in running server");
    }
});
