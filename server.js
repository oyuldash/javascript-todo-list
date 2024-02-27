const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 4000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
// import mongoDB url
const keys = require('./config/keys');
// load models
const Todo = require('./models/Todo');
// connect to mongoDB
mongoose.connect(keys.MONGO_URI)
.then(() => {
    console.log(`connected to MOngoDB..`)
})
.catch(e => console.log(e))
// static file serve - js, html, css
app.use(express.static('public'));
// route handler
app.post('/newitem',(req,res) => {
    console.log(req.body);
    let newTodo = {
        name:req.body.item,
        date:new Date().toString()
    }
    new Todo(newTodo).save()
    .then(() => {
        console.log('Todo item saved successfully..')
    })
    .catch(e => console.log(e))
});

app.get('/todos',(req,res) => {
    Todo.find({}).then(todos => {
        res.send(todos)
    })
    .catch(e => console.log(e))
})
// change
app.post('/deleteItem',(req,res) => {
    console.log(req.body);
    Todo.findByIdAndDelete(req.body._id)
    .then(() => {
        console.log('Item deleted successfully');
        res.send({ message:'success' })
    })
    .catch(e => console.log(e))
})

app.post('/editItem',(req,res) => {
    console.log(req.body)
    Todo.findByIdAndUpdate(
        req.body.prevItem._id,
        {name:req.body.newItem,date:new Date().toString()}
        )
    .then(() => {
        console.log('Successfully updated');
        res.send({status:'success'})
    })
    .catch(e => console.log(e))
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

//Run app, then load http://localhost:port in a browser to see the output.