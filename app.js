const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser') // cookie oluşturma
const { authKontrol, kullaniciKontrol } = require('./middleware/authMiddleware')

const app = express();

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

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

    
// Tüm sayfalarda methodu çalıştırır
app.get('*', kullaniciKontrol)

// sayfa çalıştığında authKontrol method devreye girer
app.get('/', authKontrol, (req, res) => {
    res.render('home')
})

// sayfa çalıştığında authKontrol method devreye girer
app.get('/works', authKontrol, (req, res) => {
    res.render('works')
})

app.use(authRoutes)


// Cookie oluşturma (alternatif)
app.get('/set-cookie', (req, res) => {
    res.setHeader('Set-Cookie', 'yeni=true')
    res.send('Cookie oluştu')
})

/* Paket ile cookie oluşturma */
app.get('/set-cookies', (req, res) => {
    res.cookie('yeni', false)
    res.cookie('parola', '12345', { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }) // 1 gün süre verilir. HttpOnly ile daha güvenli olması sağlanır.
    res.send('Cookie oluştu')
})

// Kayıt olan Cookie lere ulaşmak
app.get('/get-cookies', (req, res) => {

    const cookies = req.cookies
    console.log(cookies.yeni)
    res.json(cookies)
})