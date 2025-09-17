import express from "express";
import { 
    addReview, 
    getReviewsByBook, 
    getUserReviews, 
    updateReview, 
    deleteReview 
} from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/auth.js";

const reviewRouter = express.Router();

// All routes require authentication
reviewRouter.use(authenticateToken);

// Review routes
reviewRouter.post('/', addReview);
reviewRouter.get('/book/:bookId', getReviewsByBook);
reviewRouter.get('/user', getUserReviews);
reviewRouter.put('/:reviewId', updateReview);
reviewRouter.delete('/:reviewId', deleteReview);

export default reviewRouter;
