const express=require('express');
const router=express.Router();
const { protect,isAdmin }=require('../middleware/authMiddleware')
const { 
    getProducts,getProductById,createProductReview,
    deleteProduct, createProduct, updateProduct, //Admin
}=require('../controllers/productControllers')


router.route('/')
    .get(getProducts)
    .post(protect,isAdmin,createProduct)        //Admin

router.route('/:id/reviews').post(protect, createProductReview)
 
router.route('/:id')
    .get(getProductById)
    .delete(protect,isAdmin,deleteProduct)      //Admin
    .put(protect, isAdmin, updateProduct)       //Admin

module.exports=router;