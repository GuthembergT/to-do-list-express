const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const dbName = "todo";
const url = `mongodb+srv://admin:123@cluster0.9nt6d.mongodb.net/${dbName}?retryWrites=true&w=majority`

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('tasks').find().toArray((err, result) => {
    db.collection('tasks').countDocuments({completed:false}, (error, count) => {
      if (err) return console.log(err)
      res.render('index.ejs', {tasks: result, total:count})
    })
  })
})

app.post('/createTask', (req, res) => {
  db.collection('tasks').insertOne({task: req.body.task, completed: false}, (err, result) => {
    if (err) return console.log(err)
    res.redirect('/')
  })
})

app.put('/markCompleted', (req, res) => {
  var marked = (req.body.completed) ? 'Unmarked!' : 'Marked!';
  db.collection('tasks')
  .findOneAndUpdate({task: req.body.task, completed: req.body.completed}, {
    $set: { completed:((req.body.completed) ? false : true) }
  }, {
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(marked);
  })
})

app.delete('/singleTask', (req, res) => {
  db.collection('tasks').findOneAndDelete({task: req.body.task}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Task deleted!')
  })
})
app.delete('/completedTasks', (req, res) => {
  db.collection('tasks').deleteMany({completed: true}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Completed tasks deleted!')
  })
})
app.delete('/clear', (req, res) => {
  db.collection('tasks').deleteMany({}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('List Cleared!')
  })
})
