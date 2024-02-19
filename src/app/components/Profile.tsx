"use client"

import styled from "styled-components";
import { UserFromDB, UserToModify } from "../types";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

const StyledProfile = styled.div`
    background-color: aliceblue;
`;

export default function Profile():JSX.Element {

    const [isOpen,setIsOpen] = useState<boolean>(false);
    const [oldPassword, setOldPassword] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>();
    const [modalPassword,setModalPassword] = useState<boolean>(false);
    const [modalTitle,setModalTitle] = useState<string>('');
    const [modalMessage,setModalMessage] = useState<string>('');

    const [user,setUser] = useState<UserToModify>(
        {
            name:'',
            surname:'',
            email:'',
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

    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
        // console.log(user);
        
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(user),
          })
          .then((response: Response) => {
            if (!(response.status === 200)) {
              throw new Error("Network response was not ok");
            }
            setModalTitle("Dati Modificati");
            setModalMessage("I tuoi dati sono stati modificati correttamente");
            setIsOpen(true);
            setTimeout(()=>{
              setIsOpen(false);
              getUserDetails();
            },1500)
            
          })
          .catch((error:Error)=>{
            setModalTitle("Dati NON Modificati");
            setModalMessage("Ci sono stati problemi nella modifica dei tuoi dati");
            setIsOpen(true);
            setTimeout(()=>{
              setIsOpen(false);
              getUserDetails();
            },1500)
            console.log(error);
          })
    }

    function getUserDetails(){
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          })
          .then((response: Response) => {
            if (!(response.status === 200)) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data:UserFromDB)=>{
            setUser({
                name:data.name,
                surname: data.surname,
                email:data.email,
                cf:data.cf,
                role:data.role,
                street:data.address.street,
                houseNumber:data.address.houseNumber,
                city:data.address.city,
                province:data.address.province,
                postalCode:data.address.postalCode,
                piva: ''
            })
            if(data.role === 'TEACHER'){
                setUser({
                name:data.name,
                surname: data.surname,
                email:data.email,
                cf:data.cf,
                role:data.role,
                street:data.address.street,
                houseNumber:data.address.houseNumber,
                city:data.address.city,
                province:data.address.province,
                postalCode:data.address.postalCode,
                piva: data.piva
                })
            }
            console.log(data);
          })
          .catch((error:Error)=>{
            console.log(error);
          })

          
    }

    function modifyPassword(){
      setModalPassword(false);

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/modPass`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword
        })
      })
      .then((response: Response) => {
        if (!(response.status === 201)) {
          throw new Error("Network response was not ok");
        }

        setModalTitle("Password Modificata");
        setModalMessage("La tua password è stata modificata correttamente");
        setIsOpen(true);
        setTimeout(()=>{
          setIsOpen(false);
        },1500)
      }) 
      .catch((error:Error)=>{
        setModalTitle("Password NON Modificata");
        setModalMessage("La tua password NON è stata modificata");
        setIsOpen(true);
        setTimeout(()=>{
          setIsOpen(false);
          setOldPassword('');
          setNewPassword('');
          setModalPassword(true);
        },1500)
        console.log(error);
      })  
    }

    useEffect(()=>{
        getUserDetails();
    },[])


    return <StyledProfile>
        <div>
            <div className="text-center">
            <h2 className="mt-4 mb-4">Modifica dati profilo</h2>
            </div>
            {/* plus */}
    <div className="flex flex-col items-center justify-center plus icon">
    <button onClick={()=>{setModalPassword(true)}}
          className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2"
        >
          Modifica Password
        </button>
                    {/* Modal */}
                    {modalPassword && (
                <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
                  
                    <div className="absolute bg-white p-6 rounded-lg shadow-xl">
                      <div className="flex justify-end">
                    <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-6 h-6 icon"
                    onClick={()=>{setModalPassword(false)}}
                    >
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg></div>
                        {/* Titolo */}
                        <div className="mb-4 text-center">
                            <h2 className="text-lg font-semibold text-center">Modifica Password</h2>
                        </div>
                        {/* Campo di input */}
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Vecchia Password</label>
                        <input
                            type="password"
                            className="border border-gray-300 rounded-md px-3 py-2 mb-3 w-full"
                            value={oldPassword}
                            onChange={(e)=>{setOldPassword(e.target.value);}}
                            required
                        />
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Nuova Password</label>
                        <input
                            type="password"
                            className="border border-gray-300 rounded-md px-3 py-2 mb-3 w-full"
                            value={newPassword}
                            onChange={(e)=>{setNewPassword(e.target.value);}}
                            required
                        />
                        <div className="mb-2 text-center">
          <p>La password deve avere almeno 10 caratteri,</p> 
          <p>un numero, una lettera maiuscola una minuscola e almeno uno</p> 
          <p>tra i seguenti caratteri speciali: (.:;?!@#,&gt;&lt;[]{}</p>
          <p>inoltre non possono esserci più di due caratteri uguali ripetuti</p>
        </div>
                        {/* Bottone di submit */}
                        <div className="text-center">
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                             onClick={modifyPassword}
                        >
                            Modifica
                        </button>
                        </div>
                        
                    </div>
                </div>
            )}
</div>
            <form onSubmit={handleSubmit} >
        <div className="tailwind-form max-w-screen-lg mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-64">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-6 lg:col-span-3">
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              Nome
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name"
                id="name"
                value={user.name} onChange={handleInputChangeUser} required
                className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-6 lg:col-span-3">
            <label htmlFor="surname" className="block text-sm font-medium leading-6 text-gray-900">
              Cognome
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="surname"
                id="surname"
                value={user.surname} onChange={handleInputChangeUser} required
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-6 lg:col-span-3">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={user.email} onChange={handleInputChangeUser} required
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-6 lg:col-span-3">
            <label htmlFor="cf" className="block text-sm font-medium leading-6 text-gray-900">
              Codice Fiscale
            </label>
            <div className="mt-2">
              <input
                id="cf"
                name="cf"
                type="text"
                value={user.cf} onChange={handleInputChangeUser} minLength={16} maxLength={16} required
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          
          <div className="sm:col-span-6 lg:col-span-3">
            <label htmlFor="street" className="block text-sm font-medium leading-6 text-gray-900">
              Via
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="street"
                id="street"
                value={user.street} onChange={handleInputChangeUser} required
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          {
            user.role === 'TEACHER' && (<div className="sm:col-span-2">
            <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
              P.IVA
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="piva"
                autoComplete="postal-code"
                value={user.piva} onChange={handleInputChangeUser} minLength={11} maxLength={11}
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>)
          }
          
          
        </div>
        <div className="flex items-center justify-end gap-x-6 mt-8">
        <button
          type="submit"
          className="mb-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Modifica
        </button>
      </div>
      </div>
      
      </form>
        </div>
                    {/* Modal */}
                    {isOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
                  
                    <div className="absolute bg-white p-6 rounded-lg shadow-xl">
                      <div>
                        {/* Titolo */}
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-center">{modalTitle}</h2>
                        </div>

                        
                   <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >{modalMessage}</label>
              </div>

                        </div>
                    </div>
                </div>
            )}
        </StyledProfile>
}