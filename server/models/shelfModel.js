import mongoose from "mongoose";

const shelfSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    books: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        shelfType: {
            type: String,
            enum: ['saved', 'reading', 'finished', 'wishlist'],
            default: 'saved'
        },
        progress: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        currentPage: {
            type: Number,
            default: 0
        },
        totalPages: {
            type: Number,
            default: 0
        },
        addedAt: {
            type: Date,
            default: Date.now
        },
        lastReadAt: {
            type: Date,
            default: Date.now
        },
        notes: {
            type: String,
            maxLength: 1000,
            default: ""
        }
    }],
    playlists: [{
        name: {
            type: String,
            required: true,
            maxLength: 100
        },
        description: {
            type: String,
            maxLength: 500,
            default: ""
        },
        bookIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        }],
        createdAt: {
            type: Date,
            default: Date.now
        },
        isPublic: {
            type: Boolean,
            default: false
        }
    }],
    readingGoals: {
        booksPerYear: {
            type: Number,
            default: 12
        },
        pagesPerDay: {
            type: Number,
            default: 20
        },
        currentYearProgress: {
            type: Number,
            default: 0
        }
    },
    preferences: {
        defaultShelfType: {
            type: String,
            enum: ['saved', 'reading', 'finished', 'wishlist'],
            default: 'saved'
        },
        autoMarkFinished: {
            type: Boolean,
            default: true
        },
        showProgress: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});

// Index for efficient queries
shelfSchema.index({ userId: 1 });
shelfSchema.index({ 'books.bookId': 1 });
shelfSchema.index({ 'books.shelfType': 1 });

const Shelf = mongoose.model("Shelf", shelfSchema);

export default Shelf;
