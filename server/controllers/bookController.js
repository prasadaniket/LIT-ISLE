import bookModel from "../models/bookModel.js";
import { validateBookTitle, validateBookDescription, validateGenre, validatePublishedYear } from "../utils/validators.js";

export async function createBook(req, res) {
    const { title, author, genre, publishedYear, description, isbn, language, pages, fileType = 'pdf' } = req.body;
    const image = req.file ? req.file.path : '';
    const bookFile = req.files?.bookFile ? req.files.bookFile[0] : null;

    // Validate input
    const titleValidation = validateBookTitle(title);
    if (!titleValidation.isValid) {
        return res.status(400).json({ 
            success: false, 
            message: titleValidation.message 
        });
    }

    const descriptionValidation = validateBookDescription(description);
    if (!descriptionValidation.isValid) {
        return res.status(400).json({ 
            success: false, 
            message: descriptionValidation.message 
        });
    }

    const genreValidation = validateGenre(genre);
    if (!genreValidation.isValid) {
        return res.status(400).json({ 
            success: false, 
            message: genreValidation.message 
        });
    }

    const yearValidation = validatePublishedYear(publishedYear);
    if (!yearValidation.isValid) {
        return res.status(400).json({ 
            success: false, 
            message: yearValidation.message 
        });
    }

    if (!author) {
        return res.status(400).json({ 
            success: false, 
            message: "Author is required." 
        });
    }

    try {
        const bookData = {
            title,
            author,
            genre,
            publishedYear: parseInt(publishedYear),
            description,
            image,
            isbn: isbn || '',
            language: language || 'English',
            pages: pages ? parseInt(pages) : undefined,
            authorId: req.user ? req.user.id : null,
            fileType
        };

        // Add file information if book file is uploaded
        if (bookFile) {
            bookData.fileUrl = bookFile.path;
            bookData.fileSize = bookFile.size;
            bookData.isDownloadable = true;
        }

        const book = await bookModel.create(bookData);

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            book
        });
    } catch (error) {
        console.error("Create Book Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

export async function getBooks(req, res) {
    try {
        const { 
            page = 1, 
            limit = 10, 
            genre, 
            author, 
            search, 
            sortBy = 'createdAt', 
            sortOrder = 'desc',
            status = 'published'
        } = req.query;

        // Build query
        let query = { status };
        
        if (genre) {
            query.genre = genre;
        }
        
        if (author) {
            query.author = { $regex: author, $options: 'i' };
        }
        
        if (search) {
            query.$text = { $search: search };
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const books = await bookModel
            .find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-fileUrl'); // Don't include file URL in list

        const total = await bookModel.countDocuments(query);

        res.status(200).json({
            success: true,
            books,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalBooks: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error("Get Books Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

export async function getBookById(req, res) {
    try {
        const { id } = req.params;
        
        const book = await bookModel.findById(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        // Increment view count
        book.views += 1;
        await book.save();

        res.status(200).json({
            success: true,
            book
        });
    } catch (error) {
        console.error("Get Book Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

export async function updateBook(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const userId = req.user ? req.user.id : null;

        // Check if user has permission to update
        const book = await bookModel.findById(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        // Only author or admin can update
        if (book.authorId && book.authorId.toString() !== userId && req.user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this book"
            });
        }

        const updatedBook = await bookModel.findByIdAndUpdate(
            id,
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

export async function deleteBook(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : null;

        const book = await bookModel.findById(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        // Only author or admin can delete
        if (book.authorId && book.authorId.toString() !== userId && req.user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this book"
            });
        }

        await bookModel.findByIdAndDelete(id);

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
