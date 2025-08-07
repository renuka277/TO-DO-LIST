
const express =  require('express');
const mongoose = require('mongoose');
const cors = require('cors');




const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/todo_database')
.then( ()=>console.log("connected") )
.catch((err)=> console.log("not connected"+err))

const todoschema = new mongoose.Schema({
    title : String,
    description : String
    
})

const todoModel = mongoose.model('task',todoschema)

app.post('/todo',async (req,res)=>{
    const {title,description}=req.body;
    
    try{
        const newtodo = new todoModel({title,description});
        await newtodo.save();
        res.status(200).json(newtodo);
    }
    catch{
        console.log("error")
        res.status(500);
    }
    
    
    

})

app.get('/todo',async (req,res)=>{
    try{
        const todo = await todoModel.find()
        res.json(todo);
    }
    catch{
        console.log("error")
        res.status(500);
    }
})

app.put('/todo/:id', async (req,res)=>{
    
    try{
        const {title,description} = req.body;
        const id = req.params.id
        const  u_todo =await todoModel.findByIdAndUpdate(
            id,
            {title,description},
            {new:true}
        )
        if (u_todo){
            res.json(u_todo)
        }
        else{
            res.status(404).json({message: "error"})
        }


    }
    catch{
        console.log("error")
        res.status(500);
        

    }
})

app.delete('/todo/:id', async (req,res)=>{
    try{
        const id  = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(200).end();
    }
    catch{
        console.log("error")
        res.status(500);
    }
    
})

const port = 2000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
});