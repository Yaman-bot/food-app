const express=require('express');
const router=express.Router();
const { 
        authUser,registerUser,getUserProfile,updateUserProfile,
        getUsers, getUserById, deleteUser, updateUser   
}=require('../controllers/userControllers')
const { protect,isAdmin }=require('../middleware/authMiddleware')

router.route('/')
        .post(registerUser)
        .get(protect,isAdmin,getUsers)  //Admin

router.route('/login').post(authUser);

router.route('/profile')
        .get(protect,getUserProfile)
        .put(protect,updateUserProfile)

//Admin route
router.route('/:id')
        .delete(protect,isAdmin,deleteUser)
        .get(protect, isAdmin, getUserById)
        .put(protect, isAdmin, updateUser)

module.exports = router;