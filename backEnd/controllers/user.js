// permet de hacher leS mdp pour leS sécuriser
const bcrypt = require('bcrypt');

// permet d'accéder au schéma de user 
const User = require('../models/User');

/*
permet de de vérifier l'identité des utilisateurs.
Le token JWT est généré pour permettre à l'utilisateur de rester 
authentifié pendant une certaine période de temps sans avoir à envoyer 
ses identifiants à chaque requête vers le serveur.
*/
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    // récupère la valeur passée par user et l'hash 10 fois
    bcrypt.hash(req.body.password, 10)
        // création d'un nouvel objet User
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // enregistrement du nouvel user dans la base
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {
    // récupère l'email saisie par user
    User.findOne({email: req.body.email})
    .then(user => {
        // si l'email saisie n'est pas dans la base
        if(user === null){
            res.status(401).json({message : 'Paire identifiant/mot de passe incorrecte'})
        }else{
            // sinon comparaison des hashage du mdp créé et du mdp saisi
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid){
                    res.status(401).json({message : 'Paire identifiant/mot de passe incorrecte'})  
                }else{
                    // réponse envoyer en frmat json contenant userId et le token généré par jwt.sign
                    res.status(200).json({userId: user._id, token: jwt.sign(
                        { userId: user._id },
                        // clé secrette d'authentification du token
                        'RANDOM_TOKEN_SECRET',
                        // options supplémentaires (ici, expiration dans 24 heures).
                        { expiresIn: '24h'}
                    )});
                }
            })
            .catch(error => res.status(500).json({error}));
        }
    })
    .catch(error => res.status(500).json({ error }));
};
