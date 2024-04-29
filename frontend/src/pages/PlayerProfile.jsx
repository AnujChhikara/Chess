import { useEffect } from "react"
import { useSelector } from "react-redux"


export default function PlayerProfile() {
    const player = useSelector((state) => state.player) 
    const playerData = player.playerData[0]
    useEffect( () => {
      const fetchGame = async () => {

      try {
        
        const response = await fetch(`http://localhost:8080/api/v1/player/getPlayerGames/${playerData.playername}`)
        if(response.ok){
          const res_data = await response.json()
          console.log(res_data)
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
  return (
    <div>
      Player Profile
    </div>
  )
}
