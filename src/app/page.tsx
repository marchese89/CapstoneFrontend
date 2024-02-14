"use client"

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginAction } from './redux/actions';
import styled from 'styled-components';


const StyledHome = styled.div`
  margin-top: 10em;
  p{
    margin: 1em auto;
  }
`;



export default function Home() {

  const dispatch = useDispatch();

  useEffect(()=>{
    if(localStorage.getItem("userType")){
      dispatch(loginAction(localStorage.getItem("userType")));
    }
  },[])
  

  return (
    <StyledHome>
  <div className="xl:mx-64">
  <h2 className="text-center text-xl mx-4">
    Questo sito web è dedicato al supporto per gli studenti
  </h2>
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





