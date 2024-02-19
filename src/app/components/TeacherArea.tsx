"use client"

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react"
import styled from "styled-components";

const StyledTeacherArea = styled.div`
    margin-top: 8em;
    .selected{
        background-color: darkslategrey;
    }
`;

export default function TeacherArea(): JSX.Element{
    const router = useRouter();
    const pathname = usePathname()
    useEffect(()=>{
        if(localStorage.getItem("userType") !== "TEACHER"){
            router.push("/")
        }
    },[])
    return (
    <StyledTeacherArea>
        <h2 className="text-center font-semibold leading-7 text-gray-900">Area insegnante</h2>
        <div className="flex justify-center items-center">
              <button
                className={`${pathname === '/teacher_area/profile' ? 'selected ':''}mt-4 mr-4 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                onClick={()=>{router.push("/teacher_area/profile")}}
              >
                Profilo
              </button>
              <button
                className={`${pathname === '/teacher_area/subjects' ? 'selected ':''}mt-4 mr-4 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                onClick={()=>{router.push("/teacher_area/subjects")}}
              >
                Materie
              </button>
              <button
                className={`${pathname === '/teacher_area/requests' ? 'selected ':''}mt-4 mr-4 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                onClick={()=>{router.push("/teacher_area/requests")}}
              >
                Richieste
              </button>
              <button
                className={`${pathname === '/teacher_area/invoices' ? 'selected ':''}mt-4 mr-4 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                onClick={()=>{router.push("/teacher_area/invoices")}}
              >
                Fatture
              </button>
            </div>
    </StyledTeacherArea>)
}