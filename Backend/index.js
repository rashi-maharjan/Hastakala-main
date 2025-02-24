const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UserModel = require("./models/User")

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/user");

app.post('/signin',(req, res)=>{
   const {email, password} = req.body;
   UserModel.findOne({email: email})
   .then(user => {
    if(user) {
        if(user.password === password) {
            res.json('Success')
        } else {
            res.json('Password is incorrect')
        }
    } else {
        res.json('User not found') 
    }
   })
})

app.post('/signup',(req, res)=>{
    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.listen(
    3001,()=>{
        console.log("server is running on port 3001")
    }
)