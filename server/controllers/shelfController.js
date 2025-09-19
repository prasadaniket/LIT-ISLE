import shelfModel from "../models/shelfModel.js";
import bookModel from "../models/bookModel.js";
import Activity from "../models/activityModel.js";
import { authenticateToken } from "../middleware/auth.js";

// Add book to user's shelf
export async function addToShelf(req, res) {
    try {
        const { bookId, shelfType = 'saved' } = req.body; // shelfType: 'saved', 'reading', 'finished', 'wishlist'
        const userId = req.user.id;

        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: "Book ID is required"
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

        // Get or create user's shelf
        let shelf = await shelfModel.findOne({ userId });
        if (!shelf) {
            shelf = await shelfModel.create({ userId });
        }

        // Check if book already in shelf
        const existingBook = shelf.books.find(b => b.bookId.toString() === bookId);
        if (existingBook) {
            // Update shelf type if different
            if (existingBook.shelfType !== shelfType) {
                existingBook.shelfType = shelfType;
                existingBook.updatedAt = new Date();
                await shelf.save();
            }
        } else {
            // Add new book to shelf
            shelf.books.push({
                bookId,
                shelfType,
                addedAt: new Date()
            });
            await shelf.save();
        }

        // record activity
        await Activity.create({
            userId,
            action: 'shelf.add',
            metadata: { bookId, shelfType },
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            message: "Book added to shelf successfully",
            shelf
        });

    } catch (error) {
        console.error("Add to Shelf Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Remove book from user's shelf
export async function removeFromShelf(req, res) {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        const shelf = await shelfModel.findOne({ userId });
        if (!shelf) {
            return res.status(404).json({
                success: false,
                message: "Shelf not found"
            });
        }

        const bookIndex = shelf.books.findIndex(b => b.bookId.toString() === bookId);
        if (bookIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Book not found in shelf"
            });
        }

        shelf.books.splice(bookIndex, 1);
        await shelf.save();

        await Activity.create({
            userId,
            action: 'shelf.remove',
            metadata: { bookId },
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            message: "Book removed from shelf successfully"
        });

    } catch (error) {
        console.error("Remove from Shelf Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Get user's shelf
export async function getUserShelf(req, res) {
    try {
        const userId = req.user.id;
        const { shelfType, page = 1, limit = 20 } = req.query;

        let shelf = await shelfModel.findOne({ userId }).populate('books.bookId');
        if (!shelf) {
            shelf = await shelfModel.create({ userId });
        }

        let books = shelf.books;
        
        // Filter by shelf type if specified
        if (shelfType) {
            books = books.filter(book => book.shelfType === shelfType);
        }

        // Sort by added date (newest first)
        books.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedBooks = books.slice(startIndex, endIndex);

        res.status(200).json({
            success: true,
            books: paginatedBooks,
            totalBooks: books.length,
            totalPages: Math.ceil(books.length / limit),
            currentPage: parseInt(page)
        });

    } catch (error) {
        console.error("Get User Shelf Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Track reading progress
export async function trackProgress(req, res) {
    try {
        const { bookId, progress, currentPage, totalPages } = req.body;
        const userId = req.user.id;

        if (!bookId || progress === undefined) {
            return res.status(400).json({
                success: false,
                message: "Book ID and progress are required"
            });
        }

        const shelf = await shelfModel.findOne({ userId });
        if (!shelf) {
            return res.status(404).json({
                success: false,
                message: "Shelf not found"
            });
        }

        const book = shelf.books.find(b => b.bookId.toString() === bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found in shelf"
            });
        }

        // Update progress
        book.progress = Math.min(100, Math.max(0, progress));
        book.currentPage = currentPage || book.currentPage;
        book.totalPages = totalPages || book.totalPages;
        book.lastReadAt = new Date();

        // Auto-update shelf type based on progress
        if (book.progress === 100) {
            book.shelfType = 'finished';
        } else if (book.progress > 0) {
            book.shelfType = 'reading';
        }

        await shelf.save();

        await Activity.create({
            userId,
            action: 'reading.progress',
            metadata: { bookId, progress: book.progress },
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            message: "Progress updated successfully",
            book
        });

    } catch (error) {
        console.error("Track Progress Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Create a reading playlist
export async function createPlaylist(req, res) {
    try {
        const { name, description, bookIds } = req.body;
        const userId = req.user.id;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Playlist name is required"
            });
        }

        const shelf = await shelfModel.findOne({ userId });
        if (!shelf) {
            shelf = await shelfModel.create({ userId });
        }

        const playlist = {
            name,
            description: description || "",
            bookIds: bookIds || [],
            createdAt: new Date()
        };

        shelf.playlists.push(playlist);
        await shelf.save();

        res.status(201).json({
            success: true,
            message: "Playlist created successfully",
            playlist
        });

    } catch (error) {
        console.error("Create Playlist Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Get user's playlists
export async function getPlaylists(req, res) {
    try {
        const userId = req.user.id;

        const shelf = await shelfModel.findOne({ userId }).populate('playlists.bookIds');
        if (!shelf) {
            return res.status(200).json({
                success: true,
                playlists: []
            });
        }

        res.status(200).json({
            success: true,
            playlists: shelf.playlists
        });

    } catch (error) {
        console.error("Get Playlists Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}
