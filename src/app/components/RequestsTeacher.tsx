"use client"
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Subject,Request } from "../types";

const StyledRequestsStudent = styled.div`
    text-align: center;
    margin-top: 1em;
    .plus{
      &:hover{
        cursor: pointer;
      }
    }
    .subjects{
      display: flex;
      justify-content: center;
      height: 330px;
      ul{
        list-style-type: none;
        li{
          min-width: 300px;
          background-color: aliceblue;
          margin: 0.4em;
          padding: 0.5em;
          border-radius: 5px;
          
        }
      }
      
    }
    .icon{
            &:hover{
              cursor: pointer;
            }
      }
      .link {
    padding: 0 1em;
    border-radius: 7px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      cursor: pointer;
      /* color: #03989e;
      background-color: white;
      font-weight: bold;
      border: 1px solid #03989e; */
    }
  }
  .link.selected {
    /* color: #03989e; */
    /* background-color: white; */
    font-weight: bold;
    /* border: 1px solid #03989e; */
    background-color: darkslategrey;
  }
  .requests-table{
    width: 60%;
    
  }
  @media screen and (max-width: 640px) {
      .requests-table{
        display: none;
    
      }
      .subjects{
        height: 0px;
      }
      
      .subjects-mobile{
        display: block;
        width: 90%;
        margin-left: auto;
        margin-right: auto;
      }
  }
  @media screen and (min-width: 640px) and (max-width: 768px) {
      .requests-table{
        margin-left: 3em;
        margin-right: 3em;
      }
  }

  @media screen and(min-width: 768px) {
    .subjects-mobile{
        display: none;
      }
  }
  li{
          min-width: 300px;
          background-color: aliceblue;
          margin: 0.4em;
          padding: 0.5em;
          border-radius: 5px;
          
        }

`;


export default function RequestsTeacher(): JSX.Element {

  const [requestsList,setRequeststList] = useState<Request[]>([]);
  const [openedRequests, setOpenedRequests] = useState(true);
  const [closedRequests, setclosedRequests] = useState(true);
  const [maxPage, setMaxPage] = useState(1);
  const [pages, setPages] = useState<number[]>();
  const [selectedPage, setSelectedPage] = useState<string|number>(0);
  const router = useRouter()

  const handleCheckboxChangeOpen = () => {
    setOpenedRequests(!openedRequests);
  };
  const handleCheckboxChangeClose = () => {
    setclosedRequests(!closedRequests);
  };

     

  function getRequests(page:number){
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/byTeacher?page=${page}&size=5`, {
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
    .then((requestsPage)=>{
      const totPages = requestsPage.totalPages;
        setMaxPage(requestsPage.totalPages - 1);
        const array = [];
        for (let i = 0; i < totPages && i <= 10; i++) {
          array.push(i);
        }
        setPages(array);
        setRequeststList(requestsPage.content);
        console.log(requestsPage.content);
    })
    .catch((error:Error)=>{
      console.log(error);
    })
  }

  useEffect(()=>{
    getRequests(0);
  },[])



  return <StyledRequestsStudent>
<div className="flex items-center mb-4 justify-center">
    <input name="opened" type="checkbox" checked={openedRequests}
            onChange={handleCheckboxChangeOpen} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"/>
    <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 mr-4">Aperte</label>
    <input name="closed" type="checkbox" checked={closedRequests}
            onChange={handleCheckboxChangeClose} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"/>
    <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Chiuse</label>
</div>
<div className="subjects flex flex-column">

  {/* <ul className="list-disc"> */}
  <table className="rounded overflow-hidden requests-table">
    <thead>
      <tr>
        <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Titolo</th>
        <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Materia</th>
        <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Studente</th>
        <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Stato</th>
        <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Dettagli</th>
      </tr>
    </thead>
    <tbody className="bg-white">
    {requestsList.map((request:Request,i:number) =>(
      (((request.requestState === 'OPEN' && openedRequests))||((request.requestState === 'CLOSED' && closedRequests))) &&
      (
      // <li key={i} className="flex justify-between">
        <tr key={i}>
        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center whitespace-nowrap">{request.title}</td>
        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center whitespace-nowrap">{request.subject.name}</td>
        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center whitespace-nowrap">{` ${request.student.name} ${request.student.surname}  `}</td>
        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center whitespace-nowrap">{request.requestState === 'OPEN' ? 'APERTA':'CHIUSA'}</td>
        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center whitespace-nowrap flex justify-center">
        {/* <div className="flex">{request.requestState === 'OPEN' ? 'APERTA':'CHIUSA'}&nbsp; */}
        <svg 
          onClick={()=>{router.push(`/teacher_area/requests/${request.id}`)}} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-6 h-6 icon">
          <path strokeLinecap="round" 
          strokeLinejoin="round" 
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        </td>
        </tr>
      )
    ))
    }
    
</tbody>
</table>
</div> 

<div className="subjects-mobile hidden">
  <ul className="list-disc">
    {requestsList.map((request:Request,i:number) =>(
      (((request.requestState === 'OPEN' && openedRequests))||((request.requestState === 'CLOSED' && closedRequests))) &&
      (<li key={i} className="flex justify-between">
        {request.title}
        <div className="flex">
          {request.requestState === 'OPEN' ? 'APERTA':'CHIUSA'}&nbsp;
        <svg onClick={()=>{router.push(`/teacher_area/requests/${request.id}`)}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 icon">
  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
</svg>

  </div>
      </li>)
    ))
    }
</ul>
</div>
<div className="flex justify-center mt-4">
        {pages && pages.map((page, i) => (
          <span
            key={i}
            className={`link ${selectedPage == page ? "selected" : ""} mx-1 mr-4 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            onClick={() => {
              setSelectedPage(page);
              getRequests(page);
            }}
          >
            {page}
          </span>
        ))}
        <span className="flex justify-center items-center ">
          <input
            size={3}
            className="mx-2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-500"
            value={selectedPage}
            onChange={(e) => {
                setSelectedPage(e.target.value);
                console.log("cambio selected page...");
            }}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              const sp = Number(selectedPage);
              if(!isNaN(sp)){
                getRequests(sp);
              }
              
            }}
          >
            Vai
          </button>
          <span className="mx-2">{`max ${maxPage}`}</span>
        </span>
      </div>   
</StyledRequestsStudent>;
}