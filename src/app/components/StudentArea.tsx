"use client"

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react"
import styled from "styled-components";

const StyledStudentArea = styled.div`
    .selected{
        background-color: darkslategrey;
    }
`;

export default function StudentArea(): JSX.Element{
    const router = useRouter();
    const pathname = usePathname()
    useEffect(()=>{
        if(localStorage.getItem("userType") !== "STUDENT"){
            router.push("/")
        }
    },[])
    return (
    <StyledStudentArea>
        <div className="text-center mt-2">
        <h2 className="text-center font-semibold leading-7 text-gray-900">Area Studente</h2>
        </div>
        <div className="flex justify-center items-center">
              <button
                className={`${pathname === '/student_area/profile' ? 'selected ':''}mt-2 mr-4 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                onClick={()=>{router.push("/student_area/profile")}}
              >
                Profilo
              </button>
              
              <button
                className={`${pathname === '/student_area/requests' ? 'selected ':''}mt-2 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                onClick={()=>{router.push("/student_area/requests")}}
              >
                Richieste
              </button>
            
            </div>
    </StyledStudentArea>)
}