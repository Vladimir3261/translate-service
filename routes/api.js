const express = require('express');
const router = express.Router();
const translator = new (require('../services/Translator'));

// Software info
router.get('/software', (req, res, next) => res.json({
    name: 'Translation API',
    version: require('../package').version
}));

// Services CRUD
router.get('/providers', (req, res, next) => res.json(translator.providers()));
router.get('/services', (req, res, next) => translator.services().then(services => res.json(services)).catch(e => next(e)));
router.get('/services/:id', (req, res, next) => translator.service(req.params.id).then(service => res.json(service)).catch(e => next(e)));
router.post('/services', (req, res, next) => translator.createService(req.body).then(service => res.json(service)).catch(e => next(e)));
router.put('/services/:id', (req, res, next) => translator.editService(req.params.id, req.body).then(service => res.json(service)).catch(e => next(e)));
router.delete('/services/:id', (req, res, next) => translator.removeService(req.params.id).then(res.status(204).end()).catch(e => next(e)));

// Translate text
router.post('/translate', (req, res, next) => translator.translate(req).then(result => res.json(result)).catch(e => next(e)));

// System status (services limits usage)
router.get('/stats', (req, res, next) => translator.stats().then(stats => res.json(stats)).catch(e => next(e)));

module.exports = router;
