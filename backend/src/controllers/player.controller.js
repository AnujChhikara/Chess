import { ChessGame } from "../models/game.model.js";
import { Player } from "../models/player.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerPlayer = asyncHandler(async (req,res) => {

    const {email, playername, password} = req.body

   if(
        [email,playername,password].some((field)=> 
        field?.trim() === "")
    )
    {
      return res.status(400).json({msg: "All fields are required"})
    
    }

  const existedUser = await Player.findOne({
     $or:[ {playername},  {email}]
   })

   if (existedUser) {
    return res.status(409).json({msg: "user already exits"})
    
   }

const player = await Player.create({
    email,
    playername:playername.toLowerCase(),
    password
 })


 //checking if user created successfully
 const createdPlayer = await Player.findById(player._id).select(
    "-password -refreshToken"
)

 if(!createdPlayer){
    throw new ApiError(500, "Something went wrong while registering the user")
 }


 //if user created successfully 

 return res.status(201).json({msg:"User Registered Successfully"})


  })

//login user

const loginPlayer = asyncHandler(async(req,res)=>{
   
   const {email, playername, password} = req.body

   if(!email && !playername){
      return res.status(400).json({msg: "username or email is required"})
      
   }
    
   const player = await Player.findOne({
    $or:[ {playername},  {email}]
  })
    
   if(!player){
      return res.status(404).json({msg:"player does not exist!"})
   }
  
   const isPasswordValid = await player.isPasswordCorrect(password)

  if(!isPasswordValid){
   return res.status(401).json({msg:"Invalid user credentials!"})
}

 const loggedInUser = await Player.findById(player._id).select(
   "-password"
 )
 
 return res
 .status(200)
 .json( {msg:"User Logged In Successfully", data:loggedInUser})
 
})


const getPlayerDetails = asyncHandler(async(req,res)=> {
   const {id} = req.params

   const player = await Player.findById(id).select("-password")

   if(!player){
      return res.status(400).json({msg:'No player found with the id'})
   }

   return res.status(200).json({msg:"user deatils fetch successfully", data:player})
})

const getPlayerGames = asyncHandler(async(req,res) => {
    const {playername} = req.params

    const playerGames = await ChessGame.find({players: playername})

    if(!playerGames){
      return res.status(400).json({msg:'No game found'})
    } 

    return res.status(200).json({msg:'games fetch successfully', games:playerGames})
})

const getAllPlayers = await asyncHandler(async(req,res) => {
   const allPlayers = await Player.find()
   if(!allPlayers){
      return res.status(400).json({msg:"failed to fetch players"})
   }
   return res.status(200).json({msg:"All players fetch successfully", data:allPlayers})
})


export {
   registerPlayer,
   loginPlayer,
   getPlayerDetails,
getPlayerGames, getAllPlayers }