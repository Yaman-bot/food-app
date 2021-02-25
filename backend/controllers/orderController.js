//Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.
const expressAsyncHandler = require('express-async-handler');
const Order = require('../models/orderModel')

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems=expressAsyncHandler(async (req, res)=>{
    const { 
        orderItems,shippingAddress,paymentMethod,
        itemsPrice,deliveryPrice,totalPrice 
    }=req.body;

    if(orderItems && orderItems.length==0){
        res.status(400)
        throw new Error('No order items')
        return;
    }else{
        const order=new Order({
            user: req.user._id,orderItems, shippingAddress, paymentMethod,
            itemsPrice, deliveryPrice, totalPrice
        })

        const createdOrder=await order.save();
        res.status(201).json(createdOrder);
    }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById=expressAsyncHandler(async (req, res) =>{
    const order=await Order.findById(req.params.id).populate('user','name email');

    if(order){
        res.json(order);
    }else{
        res.status(404)
        throw new Error('Order not found');
    }
})

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid=expressAsyncHandler(async (req, res) =>{
    const order=await Order.findById(req.params.id);

    if(order){
        order.isPaid = true;
        order.paidAt=Date.now();
        order.paymentResult={
            id:req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }

        const updatedOrder=await order.save()
        res.json(updatedOrder);
    }else{
        res.status(404)
        throw new Error('Order not found');
    }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
})

//==================
//ADMIN CONTROLLERS
//==================

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name')
    res.json(orders)
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save()

        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

module.exports = { addOrderItems, getOrderById,updateOrderToPaid,getMyOrders,getOrders,updateOrderToDelivered }