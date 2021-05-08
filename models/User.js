const mongoose = require('mongoose')
const {isEmail} = require('validator') // Email format validasyonu

// User Collection Şeması
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Mail adresini girmeniz zorunludur!'],
        unique: true,
        lowercase: true,
        validate : [isEmail, 'Lütfen geçerli bir email adresini giriniz']
    },
    parola: {
        type: String,
        required: [true, 'Parolayı girmeniz zorunludur!'],
        minlength: [6, 'Parolayı minimum 6 karakter giriniz!']
    }
})

// Schema veritabanına kayıt olduktan sonra kontroller
userSchema.post('save', function(doc,next) {
    console.log('kaydedildikten sonra çalşacak', doc)
    next()
})

// Schema veritabanına kaydedilmeden önce kontroller
userSchema.pre('save', function(next) {
    console.log('kaydedilmeden çalışacak', this)
    next()
})

// DB'ye collection kaydedilmesi
const User = mongoose.model('user', userSchema)

module.exports = User;