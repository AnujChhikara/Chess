import { createSlice } from "@reduxjs/toolkit";


const playerSlice = createSlice({
    name:'player',
    initialState: {
        playerData: []
    },
    reducers:{
        updateUser(state,action){
            const newPlayer = action.payload
            state.playerData.push({
                playername: newPlayer.playername,
                email:newPlayer.email,
                id:newPlayer.id,
                rating:newPlayer.rating
            })

        }
        
       
    }
});


export const playerActions = playerSlice.actions;

export default playerSlice;