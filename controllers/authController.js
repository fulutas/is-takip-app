const User = require('../models/User')
const jwt = require('jsonwebtoken')

const hataYakala = (err) => {
    let errors = { email: '', parola: '' }

    // Kayıt edilecek mail eğer DB'de var ise;
    if (err.code === 11000) {
        errors.email = "Bu mail adresi veritabanında bulunuyor."
        return errors;
    }

    // error mesajlarında user validation failed var ise..
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }

    if (err.message === 'email-hatası') {
        errors.email = 'email adresini yanlış girdiniz!'
    }

    if (err.message === 'parola-hatası') {
        errors.parola = 'parolayı yanlış girdiniz!'
    }

    return errors;
}

// cookie son kullanım tarihi
const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 gün

const createToken = (id) => {
    return jwt.sign({ id }, 'furkan-ults', {
        expiresIn: maxAge
    })
}


module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_post = async (req, res) => {
    const { email, parola } = req.body
    console.log(email, parola)

    try {
        const user = await User.create({ email, parola })
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge })
        res.status(201).json(user)
    } catch (error) {
        // res.status(400).send({ message : 'Hata oluştu, kullanıcı oluşturulamadı.', error : error.message})
        const errors = hataYakala(error)
        res.status(400).json({ errors })
    }

}

module.exports.login_post = async (req, res) => {
    const { email, parola } = req.body

    try {
        const user = await User.login(email, parola)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge })
        res.status(200).json({ user: user._id })
    } catch (error) {
        const errors = hataYakala(error)
        res.status(400).json({ errors })
    }

    // console.log(email, parola)
    // res.send('yeni kullanıcı girişi yaptı')
}