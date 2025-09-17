import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        maxLength: 50
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true,
        minLength: 8
    },
    role: {
        type: String,
        enum: ['user', 'author', 'admin'],
        default: 'user'
    },
    bio: {
        type: String,
        maxLength: 500,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        maxLength: 200,
        default: ''
    },
    socialLinks: {
        twitter: { type: String, maxLength: 200 },
        instagram: { type: String, maxLength: 200 },
        linkedin: { type: String, maxLength: 200 },
        facebook: { type: String, maxLength: 200 }
    },
    genres: [{
        type: String,
        enum: [
            'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance', 'Fantasy',
            'Science Fiction', 'Horror', 'Biography', 'History', 'Self-Help',
            'Business', 'Health', 'Travel', 'Cooking', 'Art', 'Poetry', 'Drama',
            'Comedy', 'Adventure', 'Crime', 'Philosophy', 'Religion', 'Education',
            'Technology', 'Science', 'Nature', 'Sports', 'Music', 'Photography'
        ]
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    readingStats: {
        booksRead: { type: Number, default: 0 },
        pagesRead: { type: Number, default: 0 },
        readingStreak: { type: Number, default: 0 },
        favoriteGenres: [String]
    },
    preferences: {
        emailNotifications: { type: Boolean, default: true },
        publicProfile: { type: Boolean, default: true },
        showReadingProgress: { type: Boolean, default: true }
    }
}, { 
    timestamps: true 
});

// Indexes for better performance
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

const User = mongoose.model("User", userSchema);

export default User;
