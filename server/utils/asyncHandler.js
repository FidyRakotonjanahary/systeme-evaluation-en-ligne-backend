// src/utils/asyncHandler.js
const asyncHandler = (fn) => {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        // Si le status n'est pas défini, utiliser 500 par défaut
        const statusCode = error.status || 500;
        res.status(statusCode).json({
          success: false,
          message: error.message || "Une erreur s'est produite",
        });
      }
    };
  };
  
  module.exports = { asyncHandler };