const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById,updateOrderToPaid,getMyOrders,getOrders,updateOrderToDelivered }=require('../controllers/orderController')
const { protect,isAdmin } = require('../middleware/authMiddleware')


router.route('/')
    .post(protect, addOrderItems)
    .get(protect,isAdmin,getOrders)  //Admin
    
router.route('/myorders').get(protect, getMyOrders);

router.route('/:id').get(protect,getOrderById);

router.route('/:id/pay').put(protect,updateOrderToPaid);

router.route('/:id/deliver').put(protect, isAdmin, updateOrderToDelivered)   //Admin


module.exports = router