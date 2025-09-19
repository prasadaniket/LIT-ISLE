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
    about: {
        type: String,
        maxLength: 1000,
        default: ''
    },
    username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        maxLength: 30
    },
    phone: {
        type: String,
        maxLength: 20,
        default: '',
        unique: true,
        sparse: true,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        default: 'Prefer not to say'
    },
    avatar: {
        type: String,
        default: ''
    },
    profileImage: {
        type: String,
        default: ''
    },
    coverImage: {
        type: String,
        default: ''
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    profileCompletion: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    website: {
        type: String,
        maxLength: 200,
        default: ''
    },
    socialMedia: {
        instagram: { type: String, maxLength: 30, default: '' },
        facebook: { type: String, maxLength: 50, default: '' },
        twitter: { type: String, maxLength: 15, default: '' },
        linkedin: { type: String, maxLength: 100, default: '' }
    },
    genres: [{
        type: String,
        enum: [
            'Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Thriller', 
            'Horror', 'Biography', 'History', 'Self-Help', 'Business', 
            'Health', 'Travel', 'Cooking', 'Art', 'Drama', 'Comedy', 
            'Adventure', 'Crime', 'Philosophy', 'Religion', 'Education', 
            'Technology', 'Nature', 'Sports', 'Music', 'Photography'
        ]
    }],
    favoriteBooks: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        },
        title: String,
        author: String,
        cover: String,
        rating: {
            type: Number,
            min: 1,
            max: 5
        }
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
    },
    // Track username change timestamps to enforce rate-limiting policy
    usernameChangeHistory: {
        type: [Date],
        default: []
    }
}, { 
    timestamps: true 
});

// Method to calculate profile completion
userSchema.methods.calculateProfileCompletion = function() {
    let completed = 0;
    const total = 9; // Total fields to track
    
    if (this.name) completed++;
    if (this.username) completed++;
    if (this.profileImage) completed++;
    if (this.coverImage) completed++;
    if (this.bio) completed++;
    if (this.dateOfBirth) completed++;
    if (this.genres && this.genres.length > 0) completed++;
    if (this.favoriteBooks && this.favoriteBooks.length > 0) completed++;
    if (this.socialMedia && Object.values(this.socialMedia).some(value => value && value.trim() !== '')) completed++;
    
    const percentage = Math.round((completed / total) * 100);
    this.profileCompletion = percentage;
    this.isProfileComplete = percentage >= 80; // Consider 80% as complete
    
    return percentage;
};

// Indexes for better performance
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ username: 1 });
userSchema.index({ phone: 1 });

const User = mongoose.model("User", userSchema);

export default User;
