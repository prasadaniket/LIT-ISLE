import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    author: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    genre: {
        type: String,
        required: true,
        enum: [
            'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance', 'Fantasy',
            'Science Fiction', 'Horror', 'Biography', 'History', 'Self-Help',
            'Business', 'Health', 'Travel', 'Cooking', 'Art', 'Poetry', 'Drama',
            'Comedy', 'Adventure', 'Crime', 'Philosophy', 'Religion', 'Education',
            'Technology', 'Science', 'Nature', 'Sports', 'Music', 'Photography'
        ]
    },
    publishedYear: {
        type: Number,
        required: true,
        min: 1000,
        max: new Date().getFullYear() + 1
    },
    isbn: {
        type: String,
        trim: true,
        maxLength: 20
    },
    language: {
        type: String,
        default: 'English',
        maxLength: 50
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true,
        maxLength: 2000
    },
    pages: {
        type: Number,
        min: 1
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    },
    views: {
        type: Number,
        default: 0
    },
    downloads: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        maxLength: 50
    }],
    fileUrl: {
        type: String
    },
    fileSize: {
        type: Number // in bytes
    },
    fileType: {
        type: String,
        enum: ['pdf', 'epub', 'mobi', 'txt'],
        default: 'pdf'
    },
    isDownloadable: {
        type: Boolean,
        default: true
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for better performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ genre: 1, rating: -1 });
bookSchema.index({ authorId: 1 });
bookSchema.index({ publishedYear: -1 });
bookSchema.index({ status: 1, featured: -1 });

const Book = mongoose.model("Book", bookSchema);

export default Book;
