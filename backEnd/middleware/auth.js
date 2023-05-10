const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // le bloc try est utilisé pour essayer de vérifier la validité du token JWT envoyé dans l'en-tête de la requête
    try {

        // Récupération du token d'authentification contenu dans le header Authorization de la requête
        const token = req.headers.authorization.split(' ')[1];
        // Déchiffrement du token à l'aide de la clé secrète pour récupérer les informations encodées
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Récupération de l'ID de l'utilisateur contenu dans le token décodé
        const userId = decodedToken.userId;
        // Ajout de l'ID de l'utilisateur dans l'objet "auth" de la requête pour une utilisation ultérieure dans d'autres middlewares ou fonctions
        req.auth = {
            userId: userId
        };

     next();

    } catch(error) {
        res.status(401).json({ error });
    }
 };