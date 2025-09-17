import highlightModel from "../models/highlightModel.js";
import bookModel from "../models/bookModel.js";
import shelfModel from "../models/shelfModel.js";
import { authenticateToken } from "../middleware/auth.js";
import path from "path";
import fs from "fs";

// Add highlight/bookmark
export async function addHighlight(req, res) {
    try {
        const { 
            bookId, 
            highlightedText, 
            noteText, 
            pageNumber, 
            chapterNumber, 
            position, 
            color = 'yellow',
            tags = [],
            isBookmark = false 
        } = req.body;
        const userId = req.user.id;

        if (!bookId || !highlightedText || !pageNumber || !position) {
            return res.status(400).json({
                success: false,
                message: "Book ID, highlighted text, page number, and position are required"
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

        // Create highlight
        const highlight = await highlightModel.create({
            userId,
            bookId,
            highlightedText,
            noteText: noteText || "",
            pageNumber,
            chapterNumber: chapterNumber || null,
            position,
            color,
            tags,
            isBookmark
        });

        // Update reading progress if it's a bookmark
        if (isBookmark) {
            await updateReadingProgressHelper(userId, bookId, pageNumber, book.pages);
        }

        res.status(201).json({
            success: true,
            message: isBookmark ? "Bookmark added successfully" : "Highlight added successfully",
            highlight
        });

    } catch (error) {
        console.error("Add Highlight Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Get user's highlights for a book
export async function getBookHighlights(req, res) {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;
        const { page = 1, limit = 20, type = 'all' } = req.query; // type: 'all', 'highlights', 'bookmarks'

        let query = { userId, bookId };
        
        if (type === 'highlights') {
            query.isBookmark = false;
        } else if (type === 'bookmarks') {
            query.isBookmark = true;
        }

        const highlights = await highlightModel
            .find(query)
            .sort({ pageNumber: 1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await highlightModel.countDocuments(query);

        res.status(200).json({
            success: true,
            highlights,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalHighlights: total
            }
        });

    } catch (error) {
        console.error("Get Book Highlights Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Update highlight
export async function updateHighlight(req, res) {
    try {
        const { highlightId } = req.params;
        const { noteText, color, tags, isPublic } = req.body;
        const userId = req.user.id;

        const highlight = await highlightModel.findOne({ _id: highlightId, userId });
        if (!highlight) {
            return res.status(404).json({
                success: false,
                message: "Highlight not found"
            });
        }

        const updateData = {};
        if (noteText !== undefined) updateData.noteText = noteText;
        if (color) updateData.color = color;
        if (tags) updateData.tags = tags;
        if (isPublic !== undefined) updateData.isPublic = isPublic;

        const updatedHighlight = await highlightModel.findByIdAndUpdate(
            highlightId,
            updateData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Highlight updated successfully",
            highlight: updatedHighlight
        });

    } catch (error) {
        console.error("Update Highlight Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Delete highlight
export async function deleteHighlight(req, res) {
    try {
        const { highlightId } = req.params;
        const userId = req.user.id;

        const highlight = await highlightModel.findOne({ _id: highlightId, userId });
        if (!highlight) {
            return res.status(404).json({
                success: false,
                message: "Highlight not found"
            });
        }

        await highlightModel.findByIdAndDelete(highlightId);

        res.status(200).json({
            success: true,
            message: "Highlight deleted successfully"
        });

    } catch (error) {
        console.error("Delete Highlight Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Add book to favorites
export async function addToFavorites(req, res) {
    try {
        const { bookId } = req.body;
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

        // Check if book already in favorites
        const existingBook = shelf.books.find(b => b.bookId.toString() === bookId);
        if (existingBook) {
            // Update to favorites if not already
            if (existingBook.shelfType !== 'wishlist') {
                existingBook.shelfType = 'wishlist';
                existingBook.updatedAt = new Date();
                await shelf.save();
            }
        } else {
            // Add new book to favorites
            shelf.books.push({
                bookId,
                shelfType: 'wishlist',
                addedAt: new Date()
            });
            await shelf.save();
        }

        res.status(200).json({
            success: true,
            message: "Book added to favorites successfully"
        });

    } catch (error) {
        console.error("Add to Favorites Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Download book
export async function downloadBook(req, res) {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        if (!book.isDownloadable) {
            return res.status(403).json({
                success: false,
                message: "This book is not available for download"
            });
        }

        if (!book.fileUrl) {
            return res.status(404).json({
                success: false,
                message: "Book file not available"
            });
        }

        // Check if file exists
        const filePath = path.join(process.cwd(), book.fileUrl);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "Book file not found on server"
            });
        }

        // Increment download count
        book.downloadCount += 1;
        await book.save();

        // Set appropriate headers for download
        const fileName = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.${book.fileType}`;
        
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', getContentType(book.fileType));
        res.setHeader('Content-Length', book.fileSize || fs.statSync(filePath).size);

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('error', (error) => {
            console.error("File Stream Error:", error);
            res.status(500).json({
                success: false,
                message: "Error downloading file"
            });
        });

    } catch (error) {
        console.error("Download Book Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Get reading progress for a book
export async function getReadingProgress(req, res) {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        const shelf = await shelfModel.findOne({ userId });
        if (!shelf) {
            return res.status(200).json({
                success: true,
                progress: {
                    currentPage: 0,
                    totalPages: 0,
                    percentage: 0,
                    lastReadAt: null
                }
            });
        }

        const bookInShelf = shelf.books.find(b => b.bookId.toString() === bookId);
        if (!bookInShelf) {
            return res.status(404).json({
                success: false,
                message: "Book not found in your shelf"
            });
        }

        const book = await bookModel.findById(bookId);
        const percentage = bookInShelf.progress || 0;

        res.status(200).json({
            success: true,
            progress: {
                currentPage: bookInShelf.currentPage || 0,
                totalPages: bookInShelf.totalPages || book.pages || 0,
                percentage,
                lastReadAt: bookInShelf.lastReadAt,
                shelfType: bookInShelf.shelfType
            }
        });

    } catch (error) {
        console.error("Get Reading Progress Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Update reading progress
export async function updateReadingProgress(req, res) {
    try {
        const { bookId, currentPage, totalPages, percentage } = req.body;
        const userId = req.user.id;

        if (!bookId || currentPage === undefined) {
            return res.status(400).json({
                success: false,
                message: "Book ID and current page are required"
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
                message: "Book not found in your shelf"
            });
        }

        // Update progress
        book.currentPage = currentPage;
        book.totalPages = totalPages || book.totalPages;
        book.progress = percentage || Math.round((currentPage / book.totalPages) * 100);
        book.lastReadAt = new Date();

        // Auto-update shelf type based on progress
        if (book.progress === 100) {
            book.shelfType = 'finished';
        } else if (book.progress > 0) {
            book.shelfType = 'reading';
        }

        await shelf.save();

        res.status(200).json({
            success: true,
            message: "Reading progress updated successfully",
            progress: {
                currentPage: book.currentPage,
                totalPages: book.totalPages,
                percentage: book.progress,
                lastReadAt: book.lastReadAt
            }
        });

    } catch (error) {
        console.error("Update Reading Progress Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// Helper function to update reading progress
async function updateReadingProgressHelper(userId, bookId, pageNumber, totalPages) {
    try {
        const shelf = await shelfModel.findOne({ userId });
        if (!shelf) return;

        const book = shelf.books.find(b => b.bookId.toString() === bookId);
        if (book) {
            book.currentPage = pageNumber;
            book.totalPages = totalPages || book.totalPages;
            book.progress = Math.round((pageNumber / book.totalPages) * 100);
            book.lastReadAt = new Date();
            await shelf.save();
        }
    } catch (error) {
        console.error("Update Reading Progress Helper Error:", error);
    }
}

// Helper function to get content type
function getContentType(fileType) {
    const contentTypes = {
        'pdf': 'application/pdf',
        'epub': 'application/epub+zip',
        'mobi': 'application/x-mobipocket-ebook',
        'txt': 'text/plain'
    };
    return contentTypes[fileType] || 'application/octet-stream';
}
