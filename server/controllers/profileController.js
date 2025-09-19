import User from '../models/userModel.js';
import Activity from '../models/activityModel.js';
import { generateToken } from '../utils/generateToken.js';

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Calculate profile completion
        const profileCompletion = user.calculateProfileCompletion();
        await user.save();

        res.status(200).json({
            success: true,
            profile: {
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                bio: user.bio,
                about: user.about,
                profileImage: user.profileImage || user.avatar,
                coverImage: user.coverImage,
                website: user.website,
                socialMedia: user.socialMedia,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            },
            genres: user.genres,
            favoriteBooks: user.favoriteBooks,
            profileCompletion,
            isProfileComplete: user.isProfileComplete
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile'
        });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const {
            name,
            username,
            phone,
            dateOfBirth,
            gender,
            bio,
            about,
            profileImage,
            coverImage,
            website,
            socialMedia,
            genres,
            favoriteBooks
        } = req.body;

        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check uniqueness and policy for username
        if (username && username !== user.username) {
            const normalizedUsername = username.toLowerCase().replace(/\s+/g, '');

            // Validate pattern: lowercase letters and digits only
            const isValid = /^[a-z0-9]+$/.test(normalizedUsername);
            if (!isValid) {
                return res.status(400).json({
                    success: false,
                    field: 'username',
                    message: 'Username can only contain lowercase letters and numbers'
                });
            }

            // Enforce 3 changes per 15 days
            const now = new Date();
            const windowStart = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
            const history = (user.usernameChangeHistory || []).filter(d => new Date(d) >= windowStart);
            if (history.length >= 3) {
                // Oldest attempt still in the 15-day window
                const oldest = history.sort((a,b) => new Date(a) - new Date(b))[0];
                const nextAllowedAt = new Date(new Date(oldest).getTime() + 15 * 24 * 60 * 60 * 1000);
                const remainingMs = Math.max(0, nextAllowedAt.getTime() - now.getTime());
                const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
                return res.status(429).json({
                    success: false,
                    field: 'username',
                    message: 'Username change limit reached. Please wait before trying again.',
                    nextAllowedAt,
                    remainingDays
                });
            }

            const existingUser = await User.findOne({ username: normalizedUsername, _id: { $ne: user._id } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    field: 'username',
                    message: 'Username is already taken'
                });
            }
        }

        // Check uniqueness for phone (only if provided and changed)
        if (phone && phone !== user.phone) {
            const existingPhone = await User.findOne({ phone, _id: { $ne: user._id } });
            if (existingPhone) {
                return res.status(400).json({
                    success: false,
                    field: 'phone',
                    message: 'Phone number is already in use'
                });
            }
        }

        // Update fields
        if (name !== undefined) user.name = name;
        if (username !== undefined) {
            if (username !== user.username) {
                user.usernameChangeHistory = [
                    ...(user.usernameChangeHistory || []).filter(Boolean),
                    new Date()
                ];
            }
            user.username = username.toLowerCase().replace(/\s+/g, '');
        }
        if (phone !== undefined) user.phone = phone;
        if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
        if (gender !== undefined) user.gender = gender;
        if (bio !== undefined) user.bio = bio;
        if (about !== undefined) user.about = about;
        if (profileImage !== undefined) {
            user.profileImage = profileImage;
            user.avatar = profileImage; // Keep avatar in sync
        }
        if (coverImage !== undefined) user.coverImage = coverImage;
        if (website !== undefined) user.website = website;
        if (socialMedia !== undefined) user.socialMedia = socialMedia;
        if (genres !== undefined) user.genres = genres;
        if (favoriteBooks !== undefined) user.favoriteBooks = favoriteBooks;

        // Calculate and update profile completion
        const profileCompletion = user.calculateProfileCompletion();
        await user.save();

        // Record activity
        await Activity.create({
            userId: user._id,
            action: 'profile.update',
            metadata: {
                changedFields: Object.keys(req.body || {}),
            },
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            profile: {
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                bio: user.bio,
                about: user.about,
                profileImage: user.profileImage || user.avatar,
                coverImage: user.coverImage,
                website: user.website,
                socialMedia: user.socialMedia,
                role: user.role,
                isVerified: user.isVerified
            },
            genres: user.genres,
            favoriteBooks: user.favoriteBooks,
            profileCompletion,
            isProfileComplete: user.isProfileComplete
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating profile'
        });
    }
};

// Upload profile image
export const uploadProfileImage = async (req, res) => {
    try {
        const { imageUrl, type } = req.body; // type: 'profile' or 'cover'
        
        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (type === 'profile') {
            user.profileImage = imageUrl;
            user.avatar = imageUrl; // Keep avatar in sync
        } else if (type === 'cover') {
            user.coverImage = imageUrl;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid image type'
            });
        }

        // Calculate and update profile completion
        const profileCompletion = user.calculateProfileCompletion();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl,
            profileCompletion,
            isProfileComplete: user.isProfileComplete
        });
    } catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while uploading image'
        });
    }
};

// Get profile completion status
export const getProfileCompletion = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const profileCompletion = user.calculateProfileCompletion();
        await user.save();

        res.status(200).json({
            success: true,
            profileCompletion,
            isProfileComplete: user.isProfileComplete,
            missingFields: {
                name: !user.name,
                username: !user.username,
                profileImage: !user.profileImage,
                coverImage: !user.coverImage,
                bio: !user.bio,
                dateOfBirth: !user.dateOfBirth,
                genres: !user.genres || user.genres.length === 0,
                favoriteBooks: !user.favoriteBooks || user.favoriteBooks.length === 0,
                socialMedia: !user.socialMedia || !Object.values(user.socialMedia).some(value => value && value.trim() !== '')
            }
        });
    } catch (error) {
        console.error('Get profile completion error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile completion'
        });
    }
};
