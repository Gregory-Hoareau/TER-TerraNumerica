const {Router} = require('express');
const graphs = require('./graphs.json');
const {create_restOperator} = require('../utils/rest-operator')

//Configuration du RestOperator
const rest_operator = create_restOperator();
rest_operator.setName('graph');
rest_operator.setFilename('graph/graphs.json');
rest_operator.load();

const router = new Router();
router.get('/', (req, res) => {
    res.status(200).json(rest_operator.get());
});
router.get('/:graphId', (req, res) => {
    try {
        const graph = rest_operator.getById(req.params.graphId);
        res.status(200).json(graph);
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
        const graph = rest_operator.post(req.body);
        res.status(201).json(graph);
    } catch (e) {
        res.status(500).json(e);
    }
});
router.put('/:graphId', (req, res) => {
    try {
        const graph = rest_operator.update(req.params.graphId, req.body);
        res.status(200).json(graph);
    } catch (e) {
        if(e.name === 'ItemNotFoundError') {
            res.status(404).end();
        } else {
            res.status(500).json(e);
        }
    }
});
router.delete('/:graphId', (req, res) => {
    try {
        const graph = rest_operator.delete(req.params.graphId);
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