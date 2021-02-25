const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan=require('morgan');
const connectDB = require('./config/db')
const { notFound,errorHandler } = require('./middleware/errorMiddleware');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();

connectDB();
const app = express();

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(path.join(__dirname, '/uploads')))

app.use('/api/products',productRoutes);
app.use('/api/users',userRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/uploads',uploadRoutes);

app.get('/api/config/paypal',(req, res)=>res.send(process.env.PAYPAL_CLIENT_ID))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname,'frontend', 'build', 'index.html'))
    )
}else{
    app.get('/', (req, res) => {
        res.send('API is on!!!');
    })

}

app.use(notFound)
app.use(errorHandler)


const PORT=process.env.PORT || 5000;

app.listen(5000, () =>{
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold);
});