import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://talesofreaders:Readerunknown@clusterlivo.ycvogj0.mongodb.net/LIT-ISLE')
    .then(() => console.log("DB Connected"))
    .catch((error) => console.error("DB Connection Error:", error));
}