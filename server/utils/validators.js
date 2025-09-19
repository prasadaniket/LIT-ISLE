import validator from "validator";

// Email validation
export const validateEmail = (email) => {
    if (!email) {
        return { isValid: false, message: "Email is required" };
    }
    if (!validator.isEmail(email)) {
        return { isValid: false, message: "Please provide a valid email address" };
    }
    return { isValid: true };
};

// Password validation
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, message: "Password is required" };
    }
    if (password.length < 10) {
        return { isValid: false, message: "Password must be at least 10 characters long" };
    }
    if (!/(?=.*[a-z])/.test(password)) {
        return { isValid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
        return { isValid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!/(?=.*\d)/.test(password)) {
        return { isValid: false, message: "Password must contain at least one number" };
    }
    if (!/(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`])/.test(password)) {
        return { isValid: false, message: "Password must contain at least one special character" };
    }
    if (/\s/.test(password)) {
        return { isValid: false, message: "Password cannot contain spaces" };
    }
    return { isValid: true };
};

// Name validation
export const validateName = (name) => {
    if (!name) {
        return { isValid: false, message: "Name is required" };
    }
    if (name.length < 2) {
        return { isValid: false, message: "Name must be at least 2 characters long" };
    }
    if (name.length > 50) {
        return { isValid: false, message: "Name must be less than 50 characters" };
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return { isValid: false, message: "Name can only contain letters and spaces" };
    }
    return { isValid: true };
};

// Book title validation
export const validateBookTitle = (title) => {
    if (!title) {
        return { isValid: false, message: "Book title is required" };
    }
    if (title.length < 2) {
        return { isValid: false, message: "Book title must be at least 2 characters long" };
    }
    if (title.length > 200) {
        return { isValid: false, message: "Book title must be less than 200 characters" };
    }
    return { isValid: true };
};

// Book description validation
export const validateBookDescription = (description) => {
    if (!description) {
        return { isValid: false, message: "Book description is required" };
    }
    if (description.length < 10) {
        return { isValid: false, message: "Book description must be at least 10 characters long" };
    }
    if (description.length > 2000) {
        return { isValid: false, message: "Book description must be less than 2000 characters" };
    }
    return { isValid: true };
};

// Rating validation
export const validateRating = (rating) => {
    if (rating === undefined || rating === null) {
        return { isValid: false, message: "Rating is required" };
    }
    const numRating = Number(rating);
    if (isNaN(numRating)) {
        return { isValid: false, message: "Rating must be a number" };
    }
    if (numRating < 1 || numRating > 5) {
        return { isValid: false, message: "Rating must be between 1 and 5" };
    }
    return { isValid: true };
};

// ISBN validation
export const validateISBN = (isbn) => {
    if (!isbn) {
        return { isValid: true }; // ISBN is optional
    }
    
    // Remove hyphens and spaces
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    
    // Check if it's 10 or 13 digits
    if (cleanISBN.length === 10) {
        return validateISBN10(cleanISBN);
    } else if (cleanISBN.length === 13) {
        return validateISBN13(cleanISBN);
    } else {
        return { isValid: false, message: "ISBN must be 10 or 13 digits long" };
    }
};

// ISBN-10 validation
const validateISBN10 = (isbn) => {
    if (!/^\d{9}[\dX]$/.test(isbn)) {
        return { isValid: false, message: "Invalid ISBN-10 format" };
    }
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(isbn[i]) * (10 - i);
    }
    
    const checkDigit = isbn[9] === 'X' ? 10 : parseInt(isbn[9]);
    sum += checkDigit;
    
    if (sum % 11 !== 0) {
        return { isValid: false, message: "Invalid ISBN-10 checksum" };
    }
    
    return { isValid: true };
};

// ISBN-13 validation
const validateISBN13 = (isbn) => {
    if (!/^\d{13}$/.test(isbn)) {
        return { isValid: false, message: "Invalid ISBN-13 format" };
    }
    
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3);
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    
    if (parseInt(isbn[12]) !== checkDigit) {
        return { isValid: false, message: "Invalid ISBN-13 checksum" };
    }
    
    return { isValid: true };
};

// Genre validation
export const validateGenre = (genre) => {
    const validGenres = [
        'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance', 'Fantasy',
        'Science Fiction', 'Horror', 'Biography', 'History', 'Self-Help',
        'Business', 'Health', 'Travel', 'Cooking', 'Art', 'Poetry', 'Drama',
        'Comedy', 'Adventure', 'Crime', 'Philosophy', 'Religion', 'Education',
        'Technology', 'Science', 'Nature', 'Sports', 'Music', 'Photography'
    ];
    
    if (!genre) {
        return { isValid: false, message: "Genre is required" };
    }
    
    if (!validGenres.includes(genre)) {
        return { isValid: false, message: `Genre must be one of: ${validGenres.join(', ')}` };
    }
    
    return { isValid: true };
};

// Published year validation
export const validatePublishedYear = (year) => {
    if (!year) {
        return { isValid: false, message: "Published year is required" };
    }
    
    const numYear = Number(year);
    if (isNaN(numYear)) {
        return { isValid: false, message: "Published year must be a number" };
    }
    
    const currentYear = new Date().getFullYear();
    if (numYear < 1000 || numYear > currentYear + 1) {
        return { isValid: false, message: `Published year must be between 1000 and ${currentYear + 1}` };
    }
    
    return { isValid: true };
};

// Review text validation
export const validateReviewText = (text) => {
    if (!text) {
        return { isValid: true }; // Review text is optional
    }
    
    if (text.length > 2000) {
        return { isValid: false, message: "Review text must be less than 2000 characters" };
    }
    
    return { isValid: true };
};

// Pagination validation
export const validatePagination = (page, limit) => {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    
    if (pageNum < 1) {
        return { isValid: false, message: "Page must be greater than 0" };
    }
    
    if (limitNum < 1 || limitNum > 100) {
        return { isValid: false, message: "Limit must be between 1 and 100" };
    }
    
    return { 
        isValid: true, 
        page: pageNum, 
        limit: limitNum 
    };
};
