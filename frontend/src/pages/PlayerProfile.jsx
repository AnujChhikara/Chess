import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getPlayerbyId } from "../functions"

function formatDate(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based, so add 1
  const day = date.getDate();

  const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

  return formattedDate;
}


export default function PlayerProfile() {
    const [userGames, setUserGames] = useState()
    const [userData, setUserData] = useState()
    const player = useSelector((state) => state.player) 
    const playerData = player.playerData[0]

    useEffect( ()=>{ 
      const getPlayerDetails = async () => {
             
     const response  = await getPlayerbyId({id:playerData.id})
       if(response.status === true) {
      const data = response.data
       setUserData(data)
      } else{
      const error = response.data
      console.log(error)
  }
    
      }
      if(playerData){
        getPlayerDetails()
      }
     
    } ,[playerData]
    )


    useEffect( () => {
      const fetchGame = async () => {

      try {
        
        const response = await fetch(`http://localhost:8080/api/v1/player/getPlayerGames/${playerData.playername}`)
        if(response.ok){
          const res_data = await response.json()
          setUserGames(res_data.games)
        } else{
          const error = await response.json()
          console.log(error)
        }
      } catch (error) {
        console.log(error)
      }
    }

    if(playerData){
      fetchGame()
    }
    }, [playerData])

    console.log(userGames)
  return (
    <div className="px-20 py-8"> 
    {
      userData && <div>
        <div className="flex justify-between mb-20">

      <h2 className="mt-2 text-lg rounded-md font-bold bg-white text-black px-2 py-2 ">Playername: {playerData.playername} </h2>
          <div className="mt-2 text-lg rounded-md font-bold ">Current Rating: {userData.rating}</div>
        </div>
          
          <div>
            <p className="font-bold text-2xl mb-4">Recent games</p>
            <div className="flex flex-col space-y-4">
            <div className="flex justify-between text-center bg-slate-900 shadow-md shadow-slate-800 px-20  py-4 font-bold text-xl underline"> 
              <p>Players</p>
              <p className="ml-16">Result</p>
              <p>Moves</p>
              <p>Date</p>
            </div>
          
            { userGames &&
              userGames.slice().reverse().map((game) => (
                <div className="flex justify-between rounded-xl py-4 px-16 bg-slate-950" key={game.id}>
                  <div className="flex space-x-2">{game.players.map((player, index) =><>
                    <p className="text-lg font-semibold" key={player}>{player}</p>
                    {index !== game.players.length - 1 && <p className="text-lg font-semibold" >vs</p>}
                  </> )}</div>
                  <p>{game.winner === 'draw' ? <p> <span className="bg-gray-500 px-2 rounded-md">=</span> Draw</p>:
                   game.winner === playerData.playername ? <p className="">  <span className="bg-green-500 text-center px-2 rounded-md">+</span> Won</p>:
                    <p> <span className="bg-red-600 px-2 rounded-md">=</span> Lost</p>} </p>
                <h4>{game.moves.length}</h4>
                <p>{formatDate(game.createdAt)}</p>
                </div>
              ))
            }  </div>
          </div>
      </div>
    }
     
    </div>
  )
}
