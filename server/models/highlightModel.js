import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    highlightedText: {
        type: String,
        required: true,
        maxLength: 1000
    },
    noteText: {
        type: String,
        maxLength: 2000,
        default: ""
    },
    pageNumber: {
        type: Number,
        required: true
    },
    chapterNumber: {
        type: Number,
        default: null
    },
    position: {
        start: {
            type: Number,
            required: true
        },
        end: {
            type: Number,
            required: true
        }
    },
    color: {
        type: String,
        enum: ['yellow', 'green', 'blue', 'pink', 'orange', 'purple', 'red'],
        default: 'yellow'
    },
    tags: [{
        type: String,
        maxLength: 50
    }],
    isPublic: {
        type: Boolean,
        default: false
    },
    isBookmark: {
        type: Boolean,
        default: false
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true,
            maxLength: 500
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    readingProgress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
highlightSchema.index({ userId: 1, bookId: 1 });
highlightSchema.index({ bookId: 1, pageNumber: 1 });
highlightSchema.index({ isPublic: 1, createdAt: -1 });
highlightSchema.index({ isBookmark: 1, userId: 1 });
highlightSchema.index({ tags: 1 });

const Highlight = mongoose.model("Highlight", highlightSchema);

export default Highlight;
