// Import du module multer
const multer = require('multer');

// Types MIME des images acceptées
const MIME_TYPES = { 
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

// Configuration du stockage des fichiers
const storage = multer.diskStorage({ 
    // Définition du dossier de destination
    destination: (req, file, callback) => { 
        // Callback appelé avec l'erreur éventuelle et le dossier de destination
        callback(null, 'images'); 
    },
    // Définition du nom du fichier
    filename: (req, file, callback) => { 
        // Remplacement des espaces par des underscores
        const name = file.originalname.split(' ').join('_'); 
        // Récupération de l'extension du fichier en fonction de son type MIME
        const extension = MIME_TYPES[file.mimetype]; 
        // Callback appelé avec l'erreur éventuelle et le nom du fichier généré
        callback(null, name + Date.now() + '.' + extension); 
    }
});

module.exports = multer({storage}).single('image'); // Export du middleware multer configuré avec le stockage et l'attente d'un seul fichier nommé "image"
