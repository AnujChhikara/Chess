export async function getPlayerbyId ({id}) { 
    
   
  try {
    const response =  await fetch(`http://localhost:8080/api/v1/player/getPlayerDetails/${id}`)
    
    if(response.ok){
      const res_data = await response.json()
      const playerData = res_data.data
      return {status:true, data:playerData}
     
   
   }
   else{
      const error= await response.json()
      return {status:false, data:error}

   }
} catch (error) { 
    return {status:false, data:error}
}
}

export async function getAllPlayers () { 
    
   
   try {
     const response =  await fetch('http://localhost:8080/api/v1/player/getAllPlayers')
     
     if(response.ok){
       const res_data = await response.json()
       const playerData = res_data.data
       return {status:true, data:playerData}
      
    
    }
    else{
       const error= await response.json()
       return {status:false, data:error}
 
    }
 } catch (error) { 
     return {status:false, data:error}
 }
 }