import reviewModel from "../models/reviewModel.js";
import bookModel from "../models/bookModel.js";
import { authenticateToken } from "../middleware/auth.js";

// Add a review for a book
export async function addReview(req, res) {
    try {
        const { bookId, rating, reviewText } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!bookId || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Book ID and rating (1-5) are required"
            });
        }

        // Check if book exists
        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        // Check if user already reviewed this book
        const existingReview = await reviewModel.findOne({ userId, bookId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this book"
            });
        }

        // Create review
        const review = await reviewModel.create({
            userId,
            bookId,
            rating,
            reviewText: reviewText || ""
        });

        // Update book's average rating
        await updateBookRating(bookId);

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review
        });

    } catch (error) {
        console.error("Add Review Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Get reviews for a specific book
export async function getReviewsByBook(req, res) {
    try {
        const { bookId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const reviews = await reviewModel
            .find({ bookId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await reviewModel.countDocuments({ bookId });

        res.status(200).json({
            success: true,
            reviews,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });

    } catch (error) {
        console.error("Get Reviews Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Get user's reviews
export async function getUserReviews(req, res) {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const reviews = await reviewModel
            .find({ userId })
            .populate('bookId', 'title author image')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await reviewModel.countDocuments({ userId });

        res.status(200).json({
            success: true,
            reviews,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });

    } catch (error) {
        console.error("Get User Reviews Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Update a review
export async function updateReview(req, res) {
    try {
        const { reviewId } = req.params;
        const { rating, reviewText } = req.body;
        const userId = req.user.id;

        const review = await reviewModel.findOne({ _id: reviewId, userId });
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        review.rating = rating || review.rating;
        review.reviewText = reviewText || review.reviewText;
        await review.save();

        // Update book's average rating
        await updateBookRating(review.bookId);

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review
        });

    } catch (error) {
        console.error("Update Review Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Delete a review
export async function deleteReview(req, res) {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await reviewModel.findOne({ _id: reviewId, userId });
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        const bookId = review.bookId;
        await reviewModel.findByIdAndDelete(reviewId);

        // Update book's average rating
        await updateBookRating(bookId);

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.error("Delete Review Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Helper function to update book's average rating
async function updateBookRating(bookId) {
    try {
        const reviews = await reviewModel.find({ bookId });
        if (reviews.length === 0) return;

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await bookModel.findByIdAndUpdate(bookId, { 
            rating: Math.round(averageRating * 10) / 10 
        });
    } catch (error) {
        console.error("Update Book Rating Error:", error);
    }
}
