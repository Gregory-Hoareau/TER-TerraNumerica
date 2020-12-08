// "Import"
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Import des routers
const graphRouter = require('./graph');
const statRouter = require('./stat');

//Création du serveur
const app = express();

//Configuration du serveur
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]'));
app.use('/graph', graphRouter);
app.use('/stat', statRouter)

const port = 8080
const hostname = 'localhost';

//Lancement du serveur
const server = app.listen(port, hostname, () => {
    console.log(`Server is listening on http://${hostname}:${port}`)
})

app.get('/', (req, res) => {
    res.status(200).json({mes: 'OK'})
})