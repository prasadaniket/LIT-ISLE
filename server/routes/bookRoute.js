import express from "express";
import multer from "multer";
import { createBook, getBooks, getBookById, updateBook, deleteBook } from "../controllers/bookController.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";

const bookRouter = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'bookFile') {
            cb(null, 'uploads/books/');
        } else {
            cb(null, 'uploads/covers/');
        }
    },
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit for book files
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'image') {
            // Cover image validation
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Cover image must be an image file'), false);
            }
        } else if (file.fieldname === 'bookFile') {
            // Book file validation
            const allowedTypes = ['application/pdf', 'application/epub+zip', 'application/x-mobipocket-ebook', 'text/plain'];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Book file must be PDF, EPUB, MOBI, or TXT'), false);
            }
        } else {
            cb(new Error('Invalid file field'), false);
        }
    }
});

// Public routes
bookRouter.get('/', optionalAuth, getBooks);
bookRouter.get('/:id', optionalAuth, getBookById);

// Protected routes
bookRouter.post('/create', authenticateToken, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'bookFile', maxCount: 1 }
]), createBook);
bookRouter.put('/:id', authenticateToken, updateBook);
bookRouter.delete('/:id', authenticateToken, deleteBook);

export default bookRouter;
