const express = require('express');
const engines = require('consolidate');
const app = express();

app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://truongvinh:vinh1432@cluster0.qdthm.mongodb.net/test';

app.get('/all',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("Ass2");
    let results = await dbo.collection("Product").find({}).toArray();
    res.render('allSanPham',{sanPham:results});
})

app.get('/add', function(req,res){
    res.render('addProduct');
})

app.get('/login',function(req,res){
    res.render('login');
})

app.post('/doAddProduct', async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("Ass2");
    let Customer = req.body.txtCustomer;
    let Product = req.body.txtProduct;
    let Price = req.body.txtPrice;
    let Quantity = req.body.txtQuantity;
    let Total = req.body.txtTotal;

    let newProduct = {Customer: Customer,Product:Product,Price:Price,Quantity:Quantity,Total:Total};

    await dbo.collection("Product").insertOne(newProduct);
    console.log(newProduct);

    res.redirect('/all');
})

app.get('/delete', async function(req,res){
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id":ObjectID(id)};

    
    let client= await MongoClient.connect(url);
    let dbo = client.db("Ass2");

    
    
    await dbo.collection("Product").deleteOne(condition);

    res.redirect('/all');
})



const PORT = process.env.PORT || 3000
var server=app.listen(PORT,function() {
    console.log("Server is running at " + PORT);
});