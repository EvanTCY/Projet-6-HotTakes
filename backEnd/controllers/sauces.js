// permet d'utiliser le schema de la sauce 
const Sauce = require('../models/Sauce');
// fournit des fonctionnalités pour travailler avec le système de fichiers,
const fs = require('fs');


/******************* READ *******************/

// chercher toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};
// chercher une sauce en particulier
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(201).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

/******************* READ *******************/


/******************* CREATE *******************/

exports.createSauce = (req, res, next) => {

    // Parsing de l'objet sauce à partir du corps de la requête
    const sauceObject = JSON.parse(req.body.sauce);

    // Suppression des champs _id et _userId qui ne doivent pas être définis par l'utilisateur
    delete sauceObject._id;
    delete sauceObject._userId;

    // Création d'un nouvel objet Sauce avec les champs de l'objet sauce, l'ID de l'utilisateur connecté et l'URL de l'image
    const sauce = new Sauce({
        // l'opérateur de décomposition '...' copie tous les champs de l'objet sauce
        ...sauceObject,
        // Ajoute l'ID de l'utilisateur connecté
        userId: req.auth.userId, 
        // Ajoute l'URL de l'image de la sauce
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        userLiked: [],
        userDisliked: []
    });

    // Enregistrement de la sauce dans la base de données
    sauce.save()
    .then(() => {
        res.status(201).json({message: 'Sauce enregistrée'})
    })
    .catch(error => {
        res.status(400).json( {error} )
    });
};

/******************* CREATE *******************/


/******************* UPDATE *******************/

exports.modifySauce = (req, res, next) => { 
    const sauceObject = req.file ? { // Si req.file existe (si l'utilisateur a envoyé une image), crée un objet sauceObject qui contient tous les champs de l'objet req.body (parsed par bodyParser) avec une imageUrl ajoutée
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; // Sinon, crée simplement un objet sauceObject qui contient tous les champs de l'objet req.body (parsed par bodyParser)

    delete sauceObject._userId; // Supprime la clé _userId de l'objet sauceObject (qui ne doit pas être modifiée)

    Sauce.findOne({_id: req.params.id}) // Cherche la sauce correspondant à l'ID de la requête dans la base de données
    .then((sauce) => { // Si la sauce est trouvée
        if(sauce.userId != req.auth.userId){ // Vérifie si l'utilisateur est bien l'auteur de la sauce (en comparant les IDs)
            res.status(401).json({ message: 'Not authorized' }) // Si l'utilisateur n'est pas l'auteur de la sauce, retourne une erreur 401 (non autorisé)
        }else{
            Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id}) // Si l'utilisateur est l'auteur de la sauce, met à jour la sauce avec les nouvelles valeurs de sauceObject
            .then(() => res.status(200).json({ message: 'Sauce modifiée'})) 
            .catch(error => res.status(401).json({ error })); 
        };
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};



exports.likeSauce = (req, res, next) => {

    const userId = req.auth.userId; // Récupère l'ID de l'utilisateur authentifié depuis le token
    const like = req.body.like; // Récupère la valeur du like (1: like, 0: annuler, -1: dislike) depuis le corps de la requête

    Sauce.findOne({ _id: req.params.id }) // Recherche la sauce dans la base de données
      .then(sauce => {
        if (!sauce) { // Vérifie si la sauce existe
          return res.status(404).json({ error: "Sauce introuvable" }); // Retourne une erreur 404 si la sauce n'est pas trouvée
        }

        // Ajouter ou supprimer l'ID de l'utilisateur au tableau approprié en fonction de sa préférence
        switch (like) {
          case 1:
            sauce.usersLiked.push(userId); // Ajoute l'ID de l'utilisateur au tableau des likes
            sauce.likes += 1;
            break;
          case 0:
            if (sauce.usersLiked.includes(userId)) { // Vérifie si l'utilisateur a déjà liké la sauce
              sauce.usersLiked.pull(userId); // Retire l'ID de l'utilisateur du tableau des likes
              sauce.likes -= 1; // Diminue le nombre total de likes
            }
            if (sauce.usersDisliked.includes(userId)) { // Vérifie si l'utilisateur a déjà disliké la sauce
              sauce.usersDisliked.pull(userId); // Retire l'ID de l'utilisateur du tableau des dislikes
              sauce.dislikes -= 1; // Diminue le nombre total de dislikes
            }
            break;
          case -1:
            sauce.usersDisliked.push(userId); // Ajoute l'ID de l'utilisateur au tableau des dislikes
            sauce.dislikes += 1;
            break;
          default:
            return res.status(400).json({ error: "Valeur de like invalide" }); // Retourne une erreur 400 si la valeur de like n'est pas valide
        }
        
        sauce.save() // Sauvegarde les modifications de la sauce dans la base de données
          .then(() => {
            res.status(200).json({ message: "Sauce modifié" }); // Retourne une réponse 200 avec un message de confirmation
          })
          .catch(error => {
            res.status(500).json({ message: 'sauce ne peut pas être modifié' + error }); // Retourne une erreur 500 en cas d'erreur lors de la sauvegarde
          });
      })
      .catch(error => {
        res.status(500).json({ message: 'findOne introuvable' + error }); // Retourne une erreur 500 en cas d'erreur lors de la recherche de la sauce dans la base de données
      });
  };

/******************* UPDATE *******************/


/******************* DELETE *******************/

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) // Recherche de la sauce correspondant à l'ID fourni
    .then((sauce) => {
        if(sauce.userId != req.auth.userId){ // Vérification que l'utilisateur connecté est bien l'auteur de la sauce
            res.status(401).json({message : 'Not authorized'}); // Si ce n'est pas le cas, renvoie un code d'erreur 401
        }else{
            const filename = sauce.imageUrl.split('/images/')[1]; // Récupération du nom du fichier image associé à la sauce
            fs.unlink(`images/${filename}`, () => { // Suppression du fichier image correspondant sur le serveur
                Sauce.deleteOne({_id: req.params.id}) // Suppression de la sauce dans la base de données
                    .then(() => {res.status(200).json({messag : 'Sauce supprimée' })}) 
                    .catch(error => res.status(401).json({ error })); 
            });
        };
    })
    .catch(error => {
        res.status(500).json({ error }); 
    });
};

/******************* DELETE *******************/
