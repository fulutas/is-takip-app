const mongoose = require('mongoose')
const {isEmail} = require('validator') // Email format validasyonu
const bcrypt = require('bcrypt') // parola şifreleme

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

// Schema veritabanına kayıt olduktan sonra kontroller - doc veriyi döndürür.
// userSchema.post('save', function(doc,next) {
//     console.log('kaydedildikten sonra çalşacak', doc)
//     next()
// })

// Schema veritabanına kaydedilmeden önce parola şifrelenir. (this yakalanan veri)
userSchema.pre('save', async function(next) {
    
    const salt = await bcrypt.genSalt()
    this.parola = await bcrypt.hash(this.parola, salt)
    next()

})


userSchema.statics.login = async function(email,parola) {
     // user schemasında gelen email isteğini collection'da arama
     const user = await this.findOne({email})

     if(user){
         // db'de kayıtlıysa şifreyi çöz
         const auth = await bcrypt.compare(parola, user.parola)
         if(auth){
             return user
         }
         throw Error('parola-hatası')
     }

     // parola hatası değilse email'dir..
     throw Error('email-hatası')
}

// DB'ye collection kaydedilmesi
const User = mongoose.model('user', userSchema)

module.exports = User;