import axios from 'axios'
import React from 'react'
import { useEffect,useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from './Button';


export default function Appbar() {
const [user,setUser] =useState(null);
const navigate = useNavigate();
useEffect (()=>{
const userToken = localStorage.getItem("token")

if(!userToken){
    navigate("/signin");
}else{
    axios.get("http://localhost:3000/api/v1/user/getUser",{
      headers:{
        Authorization: "Bearer " + userToken
      },
    })
    .then((response)=>{
      setUser(response.data);
    })
}
},[])

const signOutHandler = () =>{
  localStorage.removeItem("token");
  navigate("/signin");
}
    
  return (
   <div className='shadow h-14 flex justify-between  items-center md:px10'>
      <Link to={"dashboard"}>
      <div className='flex flex-col justify-center h-full ml-4 font-bold '>
        QuickPay App
      </div>
      </Link>
      <div className="flex items-center justify-center gap-2">
       <Button label ={"Sign Out"} onClick={signOutHandler}/>
       <div className="flex flex-col justify-center h-full mr-4">
         {user?.firstName}
        </div>
        <div className="rounded-full h-10 w-10 p-4 bg-slate-200 flex justify-center mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
         {user?.firstName[0].toUpperCase()}
          </div>
        </div>
      </div>
   </div>
    
  )
}
