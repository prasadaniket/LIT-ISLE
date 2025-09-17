import express from "express";
import { 
    addToShelf, 
    removeFromShelf, 
    getUserShelf, 
    trackProgress,
    createPlaylist,
    getPlaylists
} from "../controllers/shelfController.js";
import { authenticateToken } from "../middleware/auth.js";

const shelfRouter = express.Router();

// All routes require authentication
shelfRouter.use(authenticateToken);

// Shelf routes
shelfRouter.post('/add', addToShelf);
shelfRouter.delete('/remove/:bookId', removeFromShelf);
shelfRouter.get('/', getUserShelf);
shelfRouter.put('/progress', trackProgress);

// Playlist routes
shelfRouter.post('/playlist', createPlaylist);
shelfRouter.get('/playlists', getPlaylists);

export default shelfRouter;
