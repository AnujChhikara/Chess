import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const playerSchema = new mongoose.Schema({
    playername:{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
        trim:true,
    },
    
    password:{
        type:String,
        required:['true', 'Password is required!']
    },
    rating:{
        type:Number,
        default: 600 // Default rating set to 600
    }

},{timestamps:true})

playerSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


playerSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


export const Player = mongoose.model('Player', playerSchema)