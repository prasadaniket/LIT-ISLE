import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
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
    tags: [{
        type: String,
        maxLength: 50
    }],
    isPublic: {
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
    color: {
        type: String,
        enum: ['yellow', 'green', 'blue', 'pink', 'orange', 'purple'],
        default: 'yellow'
    }
}, {
    timestamps: true
});

// Index for efficient queries
noteSchema.index({ userId: 1, bookId: 1 });
noteSchema.index({ bookId: 1, pageNumber: 1 });
noteSchema.index({ isPublic: 1, createdAt: -1 });
noteSchema.index({ tags: 1 });

const Note = mongoose.model("Note", noteSchema);

export default Note;
