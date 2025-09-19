import userModel from "../models/userModel.js";
import bookModel from "../models/bookModel.js";
import { authenticateToken, isAuthor } from "../middleware/auth.js";

// Get author dashboard data
export async function getAuthorDashboard(req, res) {
    try {
        const userId = req.user.id;

        // Get author's books
        const books = await bookModel.find({ authorId: userId })
            .sort({ createdAt: -1 })
            .limit(10);

        // Get book statistics
        const totalBooks = await bookModel.countDocuments({ authorId: userId });
        const totalViews = await bookModel.aggregate([
            { $match: { authorId: userId } },
            { $group: { _id: null, total: { $sum: "$views" } } }
        ]);

        // Get recent reviews for author's books
        const recentReviews = await bookModel.aggregate([
            { $match: { authorId: userId } },
            { $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "bookId",
                as: "reviews"
            }},
            { $unwind: "$reviews" },
            { $sort: { "reviews.createdAt": -1 } },
            { $limit: 5 },
            { $lookup: {
                from: "users",
                localField: "reviews.userId",
                foreignField: "_id",
                as: "reviewer"
            }},
            { $project: {
                bookTitle: "$title",
                review: "$reviews",
                reviewer: { $arrayElemAt: ["$reviewer", 0] }
            }}
        ]);

        res.status(200).json({
            success: true,
            dashboard: {
                totalBooks,
                totalViews: totalViews[0]?.total || 0,
                recentBooks: books,
                recentReviews
            }
        });

    } catch (error) {
        console.error("Get Author Dashboard Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Upload a new book (author only)
export async function uploadBook(req, res) {
    try {
        const { title, description, genre, publishedYear, isbn, language } = req.body;
        const authorId = req.user.id;
        const coverImage = req.file ? req.file.path : '';

        if (!title || !description || !genre || !publishedYear) {
            return res.status(400).json({
                success: false,
                message: "Title, description, genre, and published year are required"
            });
        }

        const book = await bookModel.create({
            title,
            author: req.user.name, // Use author's name
            authorId,
            description,
            genre,
            publishedYear: parseInt(publishedYear),
            isbn: isbn || '',
            language: language || 'English',
            image: coverImage,
            status: 'published'
        });

        res.status(201).json({
            success: true,
            message: "Book uploaded successfully",
            book
        });

    } catch (error) {
        console.error("Upload Book Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Update author's book
export async function updateBook(req, res) {
    try {
        const { bookId } = req.params;
        const updateData = req.body;
        const authorId = req.user.id;

        // Check if book exists and belongs to author
        const book = await bookModel.findOne({ _id: bookId, authorId });
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found or you don't have permission to update it"
            });
        }

        // Update book
        const updatedBook = await bookModel.findByIdAndUpdate(
            bookId,
            { ...updateData, updatedAt: new Date() },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            book: updatedBook
        });

    } catch (error) {
        console.error("Update Book Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Delete author's book
export async function deleteBook(req, res) {
    try {
        const { bookId } = req.params;
        const authorId = req.user.id;

        // Check if book exists and belongs to author
        const book = await bookModel.findOne({ _id: bookId, authorId });
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found or you don't have permission to delete it"
            });
        }

        await bookModel.findByIdAndDelete(bookId);

        res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });

    } catch (error) {
        console.error("Delete Book Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Get author's books with pagination
export async function getAuthorBooks(req, res) {
    try {
        const authorId = req.user.id;
        const { page = 1, limit = 10, status, genre } = req.query;

        let query = { authorId };
        if (status) query.status = status;
        if (genre) query.genre = genre;

        const books = await bookModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await bookModel.countDocuments(query);

        res.status(200).json({
            success: true,
            books,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            totalBooks: total
        });

    } catch (error) {
        console.error("Get Author Books Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Get book analytics
export async function getBookAnalytics(req, res) {
    try {
        const { bookId } = req.params;
        const authorId = req.user.id;

        // Check if book belongs to author
        const book = await bookModel.findOne({ _id: bookId, authorId });
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found or you don't have permission to view analytics"
            });
        }

        // Get reviews for this book
        const reviews = await bookModel.aggregate([
            { $match: { _id: book._id } },
            { $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "bookId",
                as: "reviews"
            }},
            { $unwind: "$reviews" },
            { $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                averageRating: { $avg: "$reviews.rating" },
                ratingDistribution: {
                    $push: "$reviews.rating"
                }
            }}
        ]);

        // Get shelf statistics
        const shelfStats = await bookModel.aggregate([
            { $match: { _id: book._id } },
            { $lookup: {
                from: "shelves",
                localField: "_id",
                foreignField: "books.bookId",
                as: "shelfData"
            }},
            { $unwind: "$shelfData" },
            { $unwind: "$shelfData.books" },
            { $match: { "shelfData.books.bookId": book._id } },
            { $group: {
                _id: "$shelfData.books.shelfType",
                count: { $sum: 1 }
            }}
        ]);

        res.status(200).json({
            success: true,
            analytics: {
                book: {
                    title: book.title,
                    views: book.views || 0,
                    rating: book.rating || 0
                },
                reviews: reviews[0] || { totalReviews: 0, averageRating: 0, ratingDistribution: [] },
                shelfStats
            }
        });

    } catch (error) {
        console.error("Get Book Analytics Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Update author profile
export async function updateAuthorProfile(req, res) {
    try {
        const { bio, website, socialMedia, genres } = req.body;
        const userId = req.user.id;

        const updateData = {};
        if (bio) updateData.bio = bio;
        if (website) updateData.website = website;
        if (socialMedia) updateData.socialMedia = socialMedia;
        if (genres) updateData.genres = genres;

        const user = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        console.error("Update Author Profile Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}
