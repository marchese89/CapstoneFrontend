"use client"

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginAction } from './redux/actions';




export default function Home() {

  const dispatch = useDispatch();

  useEffect(()=>{
    if(localStorage.getItem("userType")){
      dispatch(loginAction(localStorage.getItem("userType")));
    }
  },[])
  

  return (
  <></>
  )
}





