const crypto= require('crypto')

exports.encryptPassword  = (password) => {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password,salt,1000,64,'sha512').toString('hex')
    return {'hash':hash,'salt':salt}
}


exports.verifyPassword = (password,salt,encryptedPassword) => {
    const hash = crypto.pbkdf2Sync(password,salt,1000,64,'sha512').toString('hex')
    return hash == encryptedPassword
}