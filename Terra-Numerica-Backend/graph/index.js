const {Router} = require('express');
const graphs = require('./graphs.json');
const RestOperator = require('../utils/rest-operator')

//Configuration du RestOperator
RestOperator.setName('graph');
RestOperator.setFilename('graph/graphs.json');
RestOperator.load();

const router = new Router();
router.get('/', (req, res) => {
    res.status(200).json(RestOperator.get());
});
router.get('/:graphId', (req, res) => {
    try {
        const graph = RestOperator.getById(req.params.graphId);
        res.status(200).json(graph);
    } catch (e) {
        if(e.name === 'ItemNotFoundError') {
            res.status(404).end();
        }
        res.status(500).json(e);
    }
});
router.post('/', (req, res) => {
    try {
        const graph = RestOperator.post(req.body);
        res.status(201).json(graph);
    } catch (e) {
        res.status(500).json(e);
    }
});
router.put('/:graphId', (req, res) => {
    try {
        const graph = RestOperator.update(req.params.graphId, req.body);
        res.status(200).json(graph);
    } catch (e) {
        if(e.name === 'ItemNotFoundError') {
            res.status(404).end();
        }
        res.status(500).json(e);
    }
});
router.delete('/:graphId', (req, res) => {
    try {
        const graph = RestOperator.delete(req.params.graphId);
        res.status(204).end();
    } catch (e) {
        if(e.name === 'ItemNotFoundError') {
            res.status(404).end();
        }
        res.status(500).json(e);
    }
});
module.exports = router;