import mongoose from 'mongoose';


const gamesArraySchema = new mongoose.Schema({
  games: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChessGame'
  }],

},{timestamps:true});

export const GamesArray = mongoose.model('GamesArray', gamesArraySchema);

