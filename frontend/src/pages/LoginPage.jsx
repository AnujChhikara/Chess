import { useState } from "react";
import socket from "../socket";
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {

  const [errorMsg, setErrorMessage] = useState('')
    const[isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate();

  const handleFormSubmittion = async(event) => {
    event.preventDefault()
    setIsProcessing(true)
    const fd = new FormData(event.currentTarget)
    const data =  Object.fromEntries(fd.entries())
    const playerData = {
      email : data.email, 
      password: data.password,
      playername:data.playername
     }

  try {
       const response =  await fetch('http://localhost:8080/api/v1/player/login',{
          method:'POST',
          headers:{
              'Content-Type':'application/json'
          },
          body:JSON.stringify(playerData)
      })
      if(response.ok){
         const res_data = await response.json()
        console.log(res_data)
        
        socket.emit("playername", data.playername);
        navigate('/liveGame');
      
      }
      else{
         const error= await response.json()
         console.log(error)
         setErrorMessage(error.msg)
         setIsProcessing(false)
      }
  } catch (error) {

    console.log(error)
    setIsProcessing(false)
  }


        
  
  
  }
  
  return (
    <div className="flex w-screen h-screen justify-center space-x-20 items-center">
      <img src="https://images.unsplash.com/photo-1634702689077-298371d09d23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2hlc3N8ZW58MHwxfDB8fHww"
      className="h-[500px] rounded-2xl shadow-md shadow-white" alt="" />
      
      <div className='flex bg-transparent h-[500px]  py-4 border-white border rounded-xl  justify-center  items-center '>
          <div className=' rounded  text-white flex  md:px-10 sm:px-4 flex-col space-y-6 justify-center items-center'>
              <div className='flex flex-col items-center mb-3'>
                <h3 className='font-semibold text-3xl'>Welcome Back!
                </h3>
                <p className='text-[12px] text-gray-300'>Don&apos;t have account yet? <Link to='/register' className='font-bold underline '>Register</Link></p>
                {
                errorMsg? <p className='text-red-400 text-sm relative'>{errorMsg}</p>: <></>
              }
               {
                !errorMsg? <p className='text-red-400 text-sm relative'></p>: <></>
              }
                </div> 
               
                
               
              <form className='flex flex-col space-y-6 '  onSubmit={handleFormSubmittion}>
                  <div className='flex flex-col space-y-4 '>
                  <input className="w-72 px-4 py-2 rounded-3xl text-black font-semibold"  name="email" placeholder="email" type="email" />
                  <p className='text-center'>or</p>
                  </div>
                  
                  <input className="w-72 px-4 py-2 rounded-3xl text-black font-semibold" name="playername" placeholder="playername" type="text" />

               
                  
                  <input className="w-72 px-4 py-2 rounded-3xl text-black font-semibold" name="password" placeholder="password" type="password" required />
                  
                  <div className='flex flex-col justify-center items-center space-y-4 pt-6'>
                  {
                    isProcessing && <button className='bg-black animate-pulse opacity-90 w-72 text-white hover:opacity-90 duration-500 px-4 py-4 rounded'>Logging in...</button>
                  }
                  {
                    !isProcessing && <button className='bg-black w-72  text-white  hover:bg-opacity-80 duration-500 px-4 py-4 rounded'>Log in</button>
                  }
                  
                  </div>
              </form>
          </div>
      
         
  
      </div>
    </div>
  )
}
