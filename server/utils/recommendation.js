// Recommendation engine for personalized book suggestions
// This is a basic implementation that can be enhanced with ML algorithms

import bookModel from "../models/bookModel.js";
import reviewModel from "../models/reviewModel.js";
import shelfModel from "../models/shelfModel.js";

// Get personalized recommendations based on user's reading history
export const getPersonalizedRecommendations = async (userId, limit = 10) => {
    try {
        // Get user's reading history
        const userShelf = await shelfModel.findOne({ userId }).populate('books.bookId');
        if (!userShelf || userShelf.books.length === 0) {
            // If no reading history, return popular books
            return await getPopularBooks(limit);
        }

        // Extract genres from user's books
        const userGenres = {};
        const userAuthors = {};
        
        userShelf.books.forEach(bookItem => {
            const book = bookItem.bookId;
            if (book) {
                userGenres[book.genre] = (userGenres[book.genre] || 0) + 1;
                userAuthors[book.author] = (userAuthors[book.author] || 0) + 1;
            }
        });

        // Get user's reviews to understand preferences
        const userReviews = await reviewModel.find({ userId }).populate('bookId');
        const likedGenres = {};
        const likedAuthors = {};
        
        userReviews.forEach(review => {
            if (review.rating >= 4) {
                const book = review.bookId;
                if (book) {
                    likedGenres[book.genre] = (likedGenres[book.genre] || 0) + 1;
                    likedAuthors[book.author] = (likedAuthors[book.author] || 0) + 1;
                }
            }
        });

        // Find similar books
        const recommendations = await findSimilarBooks(userGenres, userAuthors, likedGenres, likedAuthors, userId, limit);
        
        return recommendations;

    } catch (error) {
        console.error("Get Personalized Recommendations Error:", error);
        return await getPopularBooks(limit);
    }
};

// Find books similar to user's preferences
const findSimilarBooks = async (userGenres, userAuthors, likedGenres, likedAuthors, userId, limit) => {
    try {
        // Get books the user hasn't read yet
        const userShelf = await shelfModel.findOne({ userId });
        const readBookIds = userShelf ? userShelf.books.map(b => b.bookId) : [];

        // Build query for similar books
        const genreQuery = Object.keys(likedGenres).length > 0 ? 
            { genre: { $in: Object.keys(likedGenres) } } : 
            { genre: { $in: Object.keys(userGenres) } };

        const authorQuery = Object.keys(likedAuthors).length > 0 ? 
            { author: { $in: Object.keys(likedAuthors) } } : 
            { author: { $in: Object.keys(userAuthors) } };

        // Find books with similar genres or authors
        const similarBooks = await bookModel.find({
            $and: [
                { _id: { $nin: readBookIds } },
                { $or: [genreQuery, authorQuery] }
            ]
        })
        .sort({ rating: -1, createdAt: -1 })
        .limit(limit * 2); // Get more to filter by rating

        // Score and rank books
        const scoredBooks = similarBooks.map(book => {
            let score = book.rating || 0;
            
            // Boost score for preferred genres
            if (likedGenres[book.genre]) {
                score += likedGenres[book.genre] * 0.5;
            } else if (userGenres[book.genre]) {
                score += userGenres[book.genre] * 0.3;
            }
            
            // Boost score for preferred authors
            if (likedAuthors[book.author]) {
                score += likedAuthors[book.author] * 0.3;
            } else if (userAuthors[book.author]) {
                score += userAuthors[book.author] * 0.2;
            }
            
            return { ...book.toObject(), recommendationScore: score };
        });

        // Sort by recommendation score and return top results
        return scoredBooks
            .sort((a, b) => b.recommendationScore - a.recommendationScore)
            .slice(0, limit);

    } catch (error) {
        console.error("Find Similar Books Error:", error);
        return [];
    }
};

// Get popular books based on ratings and reviews
export const getPopularBooks = async (limit = 10) => {
    try {
        const books = await bookModel.find()
            .sort({ rating: -1, createdAt: -1 })
            .limit(limit);
        
        return books;
    } catch (error) {
        console.error("Get Popular Books Error:", error);
        return [];
    }
};

// Get trending books (recently popular)
export const getTrendingBooks = async (limit = 10, days = 30) => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const books = await bookModel.find({
            createdAt: { $gte: cutoffDate }
        })
        .sort({ rating: -1, views: -1 })
        .limit(limit);
        
        return books;
    } catch (error) {
        console.error("Get Trending Books Error:", error);
        return [];
    }
};

// Get books by genre
export const getBooksByGenre = async (genre, limit = 10) => {
    try {
        const books = await bookModel.find({ genre })
            .sort({ rating: -1, createdAt: -1 })
            .limit(limit);
        
        return books;
    } catch (error) {
        console.error("Get Books by Genre Error:", error);
        return [];
    }
};

// Get similar books to a specific book
export const getSimilarBooks = async (bookId, limit = 5) => {
    try {
        const book = await bookModel.findById(bookId);
        if (!book) {
            return [];
        }

        const similarBooks = await bookModel.find({
            $and: [
                { _id: { $ne: bookId } },
                { $or: [
                    { genre: book.genre },
                    { author: book.author }
                ]}
            ]
        })
        .sort({ rating: -1 })
        .limit(limit);
        
        return similarBooks;
    } catch (error) {
        console.error("Get Similar Books Error:", error);
        return [];
    }
};

// Get recommendations based on collaborative filtering
export const getCollaborativeRecommendations = async (userId, limit = 10) => {
    try {
        // Get users who have similar reading tastes
        const userReviews = await reviewModel.find({ userId }).populate('bookId');
        const userBookIds = userReviews.map(r => r.bookId._id.toString());
        
        if (userBookIds.length === 0) {
            return await getPopularBooks(limit);
        }

        // Find users who reviewed the same books with similar ratings
        const similarUsers = await reviewModel.aggregate([
            {
                $match: {
                    bookId: { $in: userBookIds },
                    userId: { $ne: userId }
                }
            },
            {
                $group: {
                    _id: "$userId",
                    commonBooks: { $sum: 1 },
                    avgRatingDiff: {
                        $avg: {
                            $abs: { $subtract: ["$rating", 3] } // Assuming average rating of 3
                        }
                    }
                }
            },
            {
                $match: {
                    commonBooks: { $gte: 2 }, // At least 2 common books
                    avgRatingDiff: { $lte: 1 } // Similar rating patterns
                }
            },
            {
                $sort: { commonBooks: -1 }
            },
            {
                $limit: 10
            }
        ]);

        if (similarUsers.length === 0) {
            return await getPopularBooks(limit);
        }

        // Get books liked by similar users
        const similarUserIds = similarUsers.map(u => u._id);
        const recommendedBooks = await reviewModel.aggregate([
            {
                $match: {
                    userId: { $in: similarUserIds },
                    rating: { $gte: 4 },
                    bookId: { $nin: userBookIds }
                }
            },
            {
                $group: {
                    _id: "$bookId",
                    score: { $sum: "$rating" },
                    reviewCount: { $sum: 1 }
                }
            },
            {
                $sort: { score: -1, reviewCount: -1 }
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {
                $unwind: "$book"
            },
            {
                $replaceRoot: { newRoot: "$book" }
            }
        ]);

        return recommendedBooks;

    } catch (error) {
        console.error("Get Collaborative Recommendations Error:", error);
        return await getPopularBooks(limit);
    }
};

// Get reading goals recommendations
export const getReadingGoalsRecommendations = async (userId, goalType = 'books', limit = 10) => {
    try {
        const userShelf = await shelfModel.findOne({ userId });
        if (!userShelf || !userShelf.readingGoals) {
            return await getPopularBooks(limit);
        }

        const goals = userShelf.readingGoals;
        
        if (goalType === 'books' && goals.booksPerYear) {
            // Recommend books to help reach yearly reading goal
            const currentYear = new Date().getFullYear();
            const yearStart = new Date(currentYear, 0, 1);
            
            const booksReadThisYear = await shelfModel.aggregate([
                {
                    $match: { userId }
                },
                {
                    $unwind: "$books"
                },
                {
                    $match: {
                        "books.shelfType": "finished",
                        "books.lastReadAt": { $gte: yearStart }
                    }
                },
                {
                    $count: "total"
                }
            ]);

            const booksRead = booksReadThisYear[0]?.total || 0;
            const remainingBooks = goals.booksPerYear - booksRead;
            
            if (remainingBooks > 0) {
                // Recommend shorter books if behind on goal
                const avgPages = remainingBooks > 5 ? 200 : 400;
                return await bookModel.find({
                    $expr: { $lte: [{ $strLenCP: "$description" }, avgPages * 2] } // Rough estimate
                })
                .sort({ rating: -1 })
                .limit(limit);
            }
        }

        return await getPopularBooks(limit);

    } catch (error) {
        console.error("Get Reading Goals Recommendations Error:", error);
        return await getPopularBooks(limit);
    }
};
