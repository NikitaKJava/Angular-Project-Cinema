const express = require('express')
const app = express();
const PORT = 3000;
const client = require('./dbConnection.js')

app.use(express.json())

app.listen(PORT,()=>{
    console.log('App running at the port ' + PORT);
})

app.get('/customers',(req,res)=>{
    client.query(`SELECT * FROM customer`,(err,result)=>{
        if(err){
            res.status(500).send(err.message)
        }
        else{
            res.status(200).send(result.rows)
        }

        client.end();
    })
})

//inserting customer for testing db connection
app.post('/customers/newCustomer',(req,res)=>{
    const user = req.body;
    const insertNewUser = `INSERT INTO customer(id,firstname,lastname,email,phone_number,customer_password,user_id) VALUES(${user.id},'${user.firstname}','${user.lastname}','${user.email}','${user.phone_number}','${user.customer_password}',${user.user_id})`;
    
   
    client.query(insertNewUser,(err)=>{
        if(err){
            res.status(500).send(err.message)
        }

        else{
            res.status(200).send('Customer inserted successfully!')
        }
    })
    client.end;
})