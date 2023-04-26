// permet d'utilser les fonctions de mongoose, ici Schema() ou plugin()
const mongoose = require('mongoose');

// permet de vérifier que chaque email créée dans la base est unique
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, requires : true}
});

// permet d'ajouter la fonctionnalité unique validator au schema 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);