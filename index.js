const express = require('express') 
const cors = require('cors')
const app = express()
const port = 3000

// cors - allow connection from different domains and ports
app.use(cors())

// convert json string to json object (from request)
app.use(express.json())

// mongo here...
const mongoose = require('mongoose')
const mongoDB = 'mongodb+srv://larimongo:harjoitus1@cluster0.yy4fnfq.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("Database test connected")
})

// Mongoose Scheema and Model here...
// scheema
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true } 
  })
  
  // model
  const Todo = mongoose.model('Todo', todoSchema, 'todos')
  
  // Routes here...
  app.post('/todos', async (request, response) => {
    const { text } = request.body
    const todo = new Todo({
      text: text
    })
    const savedTodo = await todo.save()
    response.json(savedTodo)  
  })

// todos-route
// app.get('/todos', (request, response) => {
//   response.send('Todos')
// })
app.get('/todos/:id', async (request, response) => {
    const todo = await Todo.findById(request.params.id)
    if (todo) response.json(todo)
    else response.status(404).end()
  })

// app listen port 3000
app.listen(port, () => {
  console.log('Example app listening on port 3000')
})

app.delete('/todos/:id', async (request, response) => {
    const deletedTodo = await Todo.findByIdAndRemove(request.params.id)
    if (deletedTodo) response.json(deletedTodo)
    else response.status(404).end()
  })