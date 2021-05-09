const jwtoken = require('jsonwebtoken')

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

module.exports = { authKontrol }