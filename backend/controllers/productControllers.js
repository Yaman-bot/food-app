//Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.
const expressAsyncHandler = require('express-async-handler');
const Product=require('../models/productModel')

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = expressAsyncHandler(async (req, res) => {
    const pageSize=8;
    const page=Number(req.query.pageNumber) || 1

    //Search functionality
    const keyword=req.query.keyword ? {
        name:{
            $regex:req.query.keyword,
            $options:'i'  //case-insensitive
        }
    }:{}
 
    const count=await Product.countDocuments({...keyword});
    const products=await Product.find({...keyword}).limit(pageSize).skip(pageSize*(page-1))
    res.json({products,page,pages:Math.ceil(count/pageSize)});
})
  
//@desc     Fetch a single products
//@route    GET /api/products/:id
//@access   Public
const getProductById = expressAsyncHandler(async (req, res) => {
    const product=await Product.findById(req.params.id)

    if(product){
        res.json(product);
    }else{
        res.status(404)
        throw new Error('Product not found');
    }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = expressAsyncHandler(async (req, res) => {
    const { rating,comment } = req.body

    const product = await Product.findById(req.params.id)
    

    if (product) {
        const alreadyReviewed=product.reviews.find(r=>r.user.toString()===req.user._i.toString());
        
        if(alreadyReviewed){
            res.status(400)
            throw new Error('Product already reviewed')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        }

        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating=product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length
        
        await product.save();
        console.log(product.reviews[0])
        res.status(201).json({ message: 'Review added' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})


//==================
//ADMIN CONTROLLERS
//==================

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        await product.remove()
        res.json({ message: 'Product removed' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = expressAsyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = expressAsyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        category,
        countInStock,
    } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})




module.exports = { getProducts, getProductById, deleteProduct, createProduct, updateProduct,createProductReview  }