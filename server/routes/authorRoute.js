import express from "express";
import multer from "multer";
import { 
    getAuthorDashboard,
    uploadBook,
    updateBook,
    deleteBook,
    getAuthorBooks,
    getBookAnalytics,
    updateAuthorProfile
} from "../controllers/authorController.js";
import { authenticateToken, isAuthor } from "../middleware/auth.js";

const authorRouter = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// All routes require authentication
authorRouter.use(authenticateToken);

// Author routes
authorRouter.get('/dashboard', isAuthor, getAuthorDashboard);
authorRouter.post('/upload', isAuthor, upload.single('coverImage'), uploadBook);
authorRouter.put('/book/:bookId', isAuthor, updateBook);
authorRouter.delete('/book/:bookId', isAuthor, deleteBook);
authorRouter.get('/books', isAuthor, getAuthorBooks);
authorRouter.get('/analytics/:bookId', isAuthor, getBookAnalytics);
authorRouter.put('/profile', isAuthor, updateAuthorProfile);

export default authorRouter;
