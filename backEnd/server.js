// http est le module qui servira à créer le server http
const http = require('http');
const app = require('./app');

// Fonction pour mettre le port dans un format standardisé et cohérent pour être utilisé par le serveur.
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Détermination du port à utiliser
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Gestionnaire d'erreurs liées au serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Gestion des erreurs du serveur
server.on('error', errorHandler);

// Écoute de l'événement "listening" lorsque le serveur démarre avec succès
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Démarrage du serveur en écoutant le port spécifié
server.listen(port);
