// src/middleware/errorHandler.js

// Classe personnalisée pour les erreurs de l'API
class APIError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Gestionnaire d'erreur pour les erreurs de développement
  const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  };
  
  // Gestionnaire d'erreur pour les erreurs de production
  const sendErrorProd = (err, res) => {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Une erreur est survenue sur le serveur.'
      });
    }
  };
  
  // Gestionnaire d'erreur pour les erreurs de base de données MySQL
  const handleMySQLError = (err) => {
    let message = 'Erreur de base de données';
  
    if (err.code === 'ER_DUP_ENTRY') {
      message = 'Cette entrée existe déjà dans la base de données';
      return new APIError(message, 400);
    }
  
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      message = 'Les données référencées n\'existent pas';
      return new APIError(message, 400);
    }
  
    if (err.code === 'ECONNREFUSED') {
      message = 'Impossible de se connecter à la base de données';
      return new APIError(message, 500); // Correction ici
    }
  
    return new APIError(message, 500);
  };
  
  // Gestionnaire d'erreur pour les erreurs de validation
  const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Données invalides. ${errors.join('. ')}`;
    return new APIError(message, 400);
  };
  
  // Middleware principal de gestion des erreurs
  const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res);
    } else {
      let error = Object.assign({}, err);
      error.message = err.message;
  
      if (error.code && error.code.startsWith('ER_')) error = handleMySQLError(error);
      if (error.name === 'ValidationError') error = handleValidationError(error);
      
      sendErrorProd(error, res);
    }
  };
  
  // Middleware pour gérer les routes non trouvées
  const notFound = (req, res, next) => {
    const err = new APIError(`Route ${req.originalUrl} non trouvée`, 404);
    next(err);
  };
  
  // Middleware pour gérer les erreurs asynchrones
  const asyncErrorHandler = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };
  
  module.exports = {
    errorHandler,
    APIError,
    notFound,
    asyncErrorHandler
  };
  