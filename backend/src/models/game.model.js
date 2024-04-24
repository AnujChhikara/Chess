import mongoose from "mongoose";

const chessGameSchema = new mongoose.Schema({
    gameId: {
        type: String,
        required: true,
        unique: true
      },
      players: [{
        type: String,
        required: true
      }],
      moves: [{
        color: String,
        piece: String,
        from: String,
        to: String,
        san: String,
        flags: String,
        lan: String,
        before: String,
        after: String
    }],
      status: {
        type: String,
        enum: ['pending', 'active', 'finished'],
        default: 'pending'
      },
      winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
      },

},{timestamps:true})

export const ChessGame = mongoose.model('ChessGame', chessGameSchema)