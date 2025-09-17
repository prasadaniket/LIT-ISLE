import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { validateEmail, validatePassword, validateName } from "../utils/validators.js";


// REGISTER FUNCTION
export async function registerUser(req, res) {
    const { username, email, password, role = 'user' } = req.body;

    // Validate input
    const nameValidation = validateName(username);
    if (!nameValidation.isValid) {
        return res.status(400).json({ 
            success: false, 
            message: nameValidation.message 
        });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
        return res.status(400).json({ 
            success: false, 
            message: emailValidation.message 
        });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return res.status(400).json({ 
            success: false, 
            message: passwordValidation.message 
        });
    }

    try {
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: "Email already registered." 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await userModel.create({
            name: username,
            email,
            password: hashedPassword,
            role
        });

        const token = generateToken({ userId: user._id });

        res.status(201).json({ 
            success: true, 
            message: "User registered successfully.", 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error. Please try again later." 
        });
    }
}

// LOGIN FUNCTION
export async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: "All fields are required." 
        });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password." 
            });
        }

        if (!user.isActive) {
            return res.status(401).json({ 
                success: false, 
                message: "Account is deactivated. Please contact support." 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password." 
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const token = generateToken({ userId: user._id });
        res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                bio: user.bio
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// GET USER PROFILE
export async function getUserProfile(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

// UPDATE USER PROFILE
export async function updateUserProfile(req, res) {
    try {
        const { name, bio, website, socialLinks, genres } = req.body;
        const userId = req.user.id;

        const updateData = {};
        if (name) {
            const nameValidation = validateName(name);
            if (!nameValidation.isValid) {
                return res.status(400).json({ 
                    success: false, 
                    message: nameValidation.message 
                });
            }
            updateData.name = name;
        }
        if (bio !== undefined) updateData.bio = bio;
        if (website !== undefined) updateData.website = website;
        if (socialLinks) updateData.socialLinks = socialLinks;
        if (genres) updateData.genres = genres;

        const user = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}
