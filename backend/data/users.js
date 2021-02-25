const bcrypt=require('bcryptjs');

const users=[
    {
        name:'Admin User',
        email:'admin@example.com',
        password:bcrypt.hashSync('123456',10),
        isAdmin:true
    },
    {
        name:'Yaman Aggarwal',
        email:'yaman2661@gmail.com',
        password:bcrypt.hashSync('yumyum00',10)
    },
    {
        name:'Rajesh',
        email:'rajesh@example.com',
        password:bcrypt.hashSync('rajesh123',10)
    },
]

module.exports=users;