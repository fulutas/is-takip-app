const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const app = express();

app.use(express.static('public'))
app.use(express.json())

app.set('view engine', 'ejs')

const dbURI = 'mongodb+srv://furkan:lqunte31@cluster1.2g63p.mongodb.net/isTakipDB?retryWrites=true&w=majority'

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then((result) => {
    app.listen(3000, () => {
        console.log("DB bağlantısı başarılı, server dinleniyor.")
    })
}).catch((err) => {
    console.log(err)
});


app.get('/', (req,res)=> {
    res.render('home')
})

app.get('/works', (req,res) => {
    res.render('works')
})

app.use(authRoutes)