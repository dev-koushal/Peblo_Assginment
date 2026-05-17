import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        if(connection){
        console.log("Database connected");
        }
       else throw new Error("Database connection failed");
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB;