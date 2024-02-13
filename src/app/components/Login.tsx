"use client"

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import {loginAction} from "../redux/actions"

const StyledLogin = styled.div`
    .outer-div{
      margin-top: 10em;
    }
`;
type UserLoginDTO = {
    email:string;
    password:string;

}

type TokenDTO = {
    token:string
    role:string
}

export default function Login(): JSX.Element{

    const router = useRouter();
    const dispatch = useDispatch();

    const [user,setUser] = useState<UserLoginDTO>(
        {
            email:'',
            password:'',
        }
    );

    function handleInputChangeUser(e: ChangeEvent<HTMLInputElement>){
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        }
        )
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
        console.log(user);
        setUser({
            email:'',
            password:'',
        })
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          })
          .then((response: Response) => {
            if (!(response.status === 200)) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((loginResponse:TokenDTO)=>{
            localStorage.setItem("authToken",loginResponse.token);
            if(loginResponse.role === "STUDENT"){
                localStorage.setItem("userType","STUDENT");
                dispatch(loginAction("STUDENT"));
                router.push("/student_area");
            }else if(loginResponse.role === "TEACHER"){
              localStorage.setItem("userType","TEACHER");
              dispatch(loginAction("TEACHER"));
                router.push("/teacher_area");
            }
            
          })
          .catch((error:Error)=>{
            console.log(error);
          })
    }

    return(
      <StyledLogin>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm outer-div">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={user.email} 
                  onChange={handleInputChangeUser}
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Password dimenticata?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={user.password}
                  onChange={handleInputChangeUser}
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Entra
              </button>
            </div>
          </form>
        </div>
        </StyledLogin>
    )
}