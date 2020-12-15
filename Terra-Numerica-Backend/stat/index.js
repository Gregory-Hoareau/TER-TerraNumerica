const {Router} = require('express');
const RestOperator = require('../utils/rest-operator')

//Configuration du RestOperator
const rest_operator = new RestOperator('stat', 'stat/stats.json');

const router = new Router();
router.get('/', (req, res) => {
    res.status(200).json(rest_operator.get());
});
router.get('/:statId', (req, res) => {
    try {
        const stat = rest_operator.getById(req.params.statId);
        res.status(200).json(stat);
    } catch (e) {
        if(e.name === 'ItemNotFoundError') {
            res.status(404).end();
        } else {
            res.status(500).json(e);
        }
    }
});
router.post('/', (req, res) => {
    try {
        const stat = rest_operator.post(req.body);
        res.status(201).json(stat);
    } catch (e) {
        res.status(500).json(e);
    }
});
router.put('/:statId', (req, res) => {
    try {
        const stat = rest_operator.update(req.params.statId, req.body);
        res.status(200).json(stat);
    } catch (e) {
        if(e.name === 'ItemNotFoundError') {
            res.status(404).end();
        } else {
            res.status(500).json(e);
        }
    }
});
router.delete('/:statId', (req, res) => {
    try {
        const stat = rest_operator.delete(req.params.statId);
        res.status(204).end();
    } catch (e) {
        if(e.name === 'ItemNotFoundError') {
            res.status(404).end();
        } else {
            res.status(500).json(e);
        }
    }
});
module.exports = router;