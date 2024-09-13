import mongoose from "mongoose";

// DB connection function
export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://bagariaria16:zooPPJA35RWLJzh1@cluster0.l4imz.mongodb.net/foodie', {
            //useNewUrlParser: true,
            //useUnifiedTopology: true,
        });
        console.log("DB connected");
    } catch (error) {
        console.error("DB connection error:", error);
        process.exit(1); // Exit the app on DB connection failure
    }
};
