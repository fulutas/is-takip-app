const jwtoken = require('jsonwebtoken')
const User = require('../models/User')

const authKontrol = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {

        jwtoken.verify(token, 'furkan-ults', (err, result) => {
            if (err) {
                console.log(err.message)
                res.redirect('/login')
            } else {
                console.log(result)
                next();
            }
        })
    }

    // token yok ise
    else {
        res.redirect('/login')
    }
}

const kullaniciKontrol = (req, res, next) => {
    // jwt isimli cookie alırız
    const token = req.cookies.jwt
    if (token) {
        jwtoken.verify(token, 'furkan-ults', async (err, result) => {
            if(err){
                res.locals.user = null;
                next()
            } else{
                // DB'den userı alırız
                let user = await User.findById(result.id)
                res.locals.user = user;
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

module.exports = { authKontrol, kullaniciKontrol }