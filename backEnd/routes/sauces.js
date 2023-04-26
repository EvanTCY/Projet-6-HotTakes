// déclaration d'express pour utiliser Router()
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config');

const saucesControllers = require('../controllers/sauces');


router.get('/', saucesControllers.getAllSauces);
router.get('/:id', saucesControllers.getOneSauce);
router.post('/', auth, multer, saucesControllers.createSauce);
router.put('/:id', auth, multer, saucesControllers.modifySauce);
router.delete('/:id', auth, saucesControllers.deleteSauce);
router.post('/:id/like', auth, saucesControllers.likeSauce);

module.exports = router;