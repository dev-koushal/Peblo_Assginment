import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true,unique:true,lowercase:true,},
    password:{type:String,required:true,trim:true,select:false},
},{timestamps:true});


userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return 
    }   
    try {
        const hashedPassword = await bcrypt.hash(this.password,10);
        this.password = hashedPassword;
        
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password,this.password)
}

const User = mongoose.model("User",userSchema);

export default User;