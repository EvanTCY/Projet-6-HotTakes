// déclarer 'express' va nous permettre d'utiliser ses fonctions comme Router() 
const express = require('express');
// permet de regrouper des routes associées dans des fichiers séparés et organiser l'application en modules
const router = express.Router();
// permet d'accéder aux fonctions du fichier appelé
const userControllers = require('../controllers/user');

// permet d'utiliser POST en utilisant les fcts de userControllers
router.post('/signup', userControllers.signup);
router.post('/login', userControllers.login);

// POURQUOI EXPORT T-ON ROUTER ?
module.exports = router;