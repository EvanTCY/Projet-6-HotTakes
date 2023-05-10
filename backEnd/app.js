const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 

// fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires
const path = require('path');

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

// mongoose
mongoose.connect('mongodb+srv://admin01_HotTakes:admin01@cluster0.jjb7qis.mongodb.net/hot_takes',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// permet à express de traité le corps de la requête
app.use(bodyParser.json());
// route utilisateur
app.use('/api/auth', userRoutes);
// route sauces
app.use('/api/sauces', saucesRoutes);
// permet de servir des fichiers images statiques depuis un dossier appelé "images" lorsque l'utilisateur accède à l'URL "http://adresse_du_serveur/images/nom_du_fichier_image".
app.use('/images', express.static(path.join(__dirname, 'images')));


// module.exports rend le code réutilisable pour un autre fichier javascript
module.exports = app;