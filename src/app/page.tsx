"use client"

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginAction } from './redux/actions';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';


const StyledHome = styled.div`
  /* margin-top: 7em; */
  p{
    margin: 1em auto;
  }
  img{
    border-radius: 30px;
  }
  section{
    background-color: whitesmoke;
  }
  background-color: aliceblue;
  
`;



export default function Home() {

  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(()=>{
    if(localStorage.getItem("userType")){
      dispatch(loginAction(localStorage.getItem("userType")));
    }
  },[])
  

  return (
    <StyledHome>
      <section className="bg-white dark:bg-gray-900">
    <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
            <h2 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white p-3">Chiedi aiuto ai nostri insegnanti</h2>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Registrati inserendo i tuoi dati, scegli la materia, invia richieste a tutti i nostri insegnanti</p>
            {/* <a href="#" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                Get started
                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </a> */}
            <a href="#" onClick={()=>{router.push("/register");}}  className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                Registrati
            </a> 
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=754&fit=clip" alt="mockup"/>
            
        </div>                
    </div>
</section>
  <div className="xl:mx-64">
  <div className="text-center">
  <h2 className="text-center text-xl mx-4 mt-4">
    Questo sito web è dedicato al supporto per gli studenti
  </h2>
  </div>
  <div className="text-center text-lg mx-4">
  <p>Gli insegnanti si possono registrare liberamente ed inserire le materie di propria competenza</p>
  <p>Gli studenti possono registrarsi allo stesso modo e inviare delle richieste inserendo la materia di competenza</p>
  <p>Tutti gli insegnanti con quella materia riceveranno la richiesta e potranno proporre una soluzione con un prezzo</p>
  <p>A questo punto lo studente potrà sceglie quale soluzione acquistare e pagare tramite carta di credito</p>
  <p>Da quel momemento in poi la soluzione sarà visibile e potrà essere rilasciato un feedback per l&apos;insegnante che ha inviato la soluzione</p>
  </div>
  </div>
  </StyledHome>
  )
}





