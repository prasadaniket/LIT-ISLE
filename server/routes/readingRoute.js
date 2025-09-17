import express from "express";
import { 
    addHighlight, 
    getBookHighlights, 
    updateHighlight, 
    deleteHighlight,
    addToFavorites,
    downloadBook,
    getReadingProgress,
    updateReadingProgress
} from "../controllers/readingController.js";
import { authenticateToken } from "../middleware/auth.js";

const readingRouter = express.Router();

// All routes require authentication
readingRouter.use(authenticateToken);

// Highlight routes
readingRouter.post('/highlight', addHighlight);
readingRouter.get('/book/:bookId/highlights', getBookHighlights);
readingRouter.put('/highlight/:highlightId', updateHighlight);
readingRouter.delete('/highlight/:highlightId', deleteHighlight);

// Favorites routes
readingRouter.post('/favorites', addToFavorites);

// Download routes
readingRouter.get('/download/:bookId', downloadBook);

// Reading progress routes
readingRouter.get('/progress/:bookId', getReadingProgress);
readingRouter.put('/progress', updateReadingProgress);

export default readingRouter;
