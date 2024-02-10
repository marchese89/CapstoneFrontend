"use client"

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { loginAction } from "../redux/actions";


const StyledRegister = styled.div`
    margin-top: 8em;
`;

type UserRegisterDTO = {
    name:string;
    surname:string;
    email:string;
    password:string;
    cf:string;
    role:string;
    street:string;
    houseNumber:string;
    city:string;
    province:string;
    postalCode:string;
    piva:string;
}

type ResponseDTO ={
    id:number
}

export default function Register(): JSX.Element{

  const router = useRouter();
  const dispatch = useDispatch();
    
    const [user,setUser] = useState<UserRegisterDTO>(
        {
            name:'',
            surname:'',
            email:'',
            password:'',
            cf:'',
            role:'',
            street:'',
            houseNumber:'',
            city:'',
            province:'',
            postalCode:'',
            piva:''
        }
    );
    
    function handleInputChangeUser(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>){
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        }
        )
    }
    type TokenDTO = {
      token:string
      role:string
  }

    function login(){
    
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            {
              email: user.email,
              password: user.password
            }
            ),
        })
        .then((response: Response) => {
          if (!(response.status === 200)) {
            throw new Error("Network response was not ok");
          }
          setUser({
            name:'',
            surname:'',
            email:'',
            password:'',
            cf:'',
            role:'',
            street:'',
            houseNumber:'',
            city:'',
            province:'',
            postalCode:'',
            piva:''
        })
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


    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
        // console.log(user);
        
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          })
          .then((response: Response) => {
            if (!(response.status === 201)) {
              throw new Error("Network response was not ok");
            }
            login();
          })
          .catch((error:Error)=>{
            console.log(error);
          })
    }

    return(
    // return(<>
    //     <StyledRegister>
    //         <div className="outer">
    //         <h2>Register</h2>
    //             <form onSubmit={handleSubmit}>
    //                 <div>
    //                 <label htmlFor="name">Nome</label>
    //                 <input type="text" name="name" value={user.name} onChange={handleInputChangeUser} required></input>
    //                 <label htmlFor="name">Cognome</label>
    //                 <input type="text" name="surname" value={user.surname} onChange={handleInputChangeUser}required></input>
    //                 </div>
    //                 <div>
    //                 <label htmlFor="name">Email</label>
    //                 <input type="text" name="email" value={user.email} onChange={handleInputChangeUser} required></input>
    //                 <label htmlFor="name">Password</label>
    //                 <input type="password" name="password" value={user.password} onChange={handleInputChangeUser} required></input>
    //                 </div>
    //                 <div>
    //                 <label htmlFor="name">CF</label>
    //                 <input type="text" name="cf" value={user.cf} onChange={handleInputChangeUser} minLength={16} maxLength={16} required></input>
    //                 <label htmlFor="name">RUOLO</label>
    //                 <select name="role" value={user.role} onChange={handleInputChangeUser} required>
    //                     <option></option>
    //                     <option value={"STUDENT"}>Studente</option>
    //                     <option value={"TEACHER"}>Insegnante</option>
    //                 </select>
    //                 {/* <input type="text" name="role" value={}></input> */}
    //                 </div>
    //                 <div>
    //                 <label htmlFor="name">Via</label>
    //                 <input type="text" name="street" value={user.street} onChange={handleInputChangeUser} required></input>
    //                 <label htmlFor="name">Numero Civico</label>
    //                 <input type="text" name="houseNumber" value={user.houseNumber} onChange={handleInputChangeUser} required></input>
    //                 </div>
    //                 <div>
    //                 <label htmlFor="name">Città</label>
    //                 <input type="text" name="city" value={user.city} onChange={handleInputChangeUser} required></input>
    //                 <label htmlFor="name">Provincia</label>
    //                 <input type="text" name="province" value={user.province} onChange={handleInputChangeUser} minLength={2} maxLength={2} required></input>
    //                 </div>
    //                 <div>
    //                 <label htmlFor="name">CAP</label>
    //                 <input type="text" name="postalCode" value={user.postalCode} onChange={handleInputChangeUser} minLength={5} maxLength={5} required></input>
    //                 <label htmlFor="name">PIVA</label>
    //                 <input type="text" name="piva" value={user.piva} onChange={handleInputChangeUser} minLength={11} maxLength={11} required></input>
    //                 </div>
    //                 <button>Registrati</button>
    //             </form>
    //         </div>
    //     </StyledRegister>
    <StyledRegister>
        <form onSubmit={handleSubmit}>
        <div className="border-b border-gray-900/10 pb-12 tailwind-form mx-auto max-w-screen-lg mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-64">
        <h2 className="text-center font-semibold leading-7 text-gray-900">Registrazione</h2>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              Nome
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name"
                id="name"
                value={user.name} onChange={handleInputChangeUser} required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="surname" className="block text-sm font-medium leading-6 text-gray-900">
              Cognome
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="surname"
                id="surname"
                value={user.surname} onChange={handleInputChangeUser} required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={user.email} onChange={handleInputChangeUser} required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={user.password} onChange={handleInputChangeUser} required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="cf" className="block text-sm font-medium leading-6 text-gray-900">
              Codice Fiscale
            </label>
            <div className="mt-2">
              <input
                id="cf"
                name="cf"
                type="text"
                value={user.cf} onChange={handleInputChangeUser} minLength={16} maxLength={16} required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          

          <div className="sm:col-span-3">
            <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
              Ruolo
            </label>
            <div className="mt-2">
              <select
                id="role"
                name="role"
                value={user.role} onChange={handleInputChangeUser} required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option></option>
                <option value={"STUDENT"}>Studente</option>
                <option value={"TEACHER"}>Insegnante</option>
              </select>
            </div>
          </div>

          <div className="col-span-3">
            <label htmlFor="street" className="block text-sm font-medium leading-6 text-gray-900">
              Via
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="street"
                id="street"
                value={user.street} onChange={handleInputChangeUser} required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="houseNumber" className="block text-sm font-medium leading-6 text-gray-900">
              Numero Civico
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="houseNumber"
                id="houseNumber"
                value={user.houseNumber} onChange={handleInputChangeUser} required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2 sm:col-start-1">
            <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
              Città
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="city"
                id="city"
                value={user.city} onChange={handleInputChangeUser} required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="province" className="block text-sm font-medium leading-6 text-gray-900">
              Provincia
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="province"
                id="region"
                 value={user.province} onChange={handleInputChangeUser} minLength={2} maxLength={2} required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
              CAP
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="postalCode"
                autoComplete="postal-code"
                 value={user.postalCode} onChange={handleInputChangeUser} minLength={5} maxLength={5} required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
              P.IVA
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="piva"
                autoComplete="postal-code"
                value={user.piva} onChange={handleInputChangeUser} minLength={11} maxLength={11}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Registrati
        </button>
      </div>
      </div>
      
      </form>
      </StyledRegister>
    )
}