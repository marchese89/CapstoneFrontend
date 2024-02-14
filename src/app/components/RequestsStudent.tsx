"use client"

import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Request, Subject } from "../types";

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
      input[type='checkbox']:focus {
          outline: none;
      }
`;


export default function RequestsStudent(): JSX.Element {

  const [requestsList,setRequeststList] = useState<Request[]>([]);
  const [subjectList,setSubjectList] = useState<Subject[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [requestTitle, setrequestTitle] = useState<string>('');
  const [subjectId,setSubjectId] = useState<number>(-1);
  const [selectedFile, setSelectedFile] = useState<File>();
  const router = useRouter()
  const [openedRequests, setOpenedRequests] = useState(true);
  const [closedRequests, setclosedRequests] = useState(true);

  const handleCheckboxChangeOpen = () => {
    setOpenedRequests(!openedRequests);
  };
  const handleCheckboxChangeClose = () => {
    setclosedRequests(!closedRequests);
  };

  const handleFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if(!fileList) return;
    setSelectedFile(fileList[0]);
  };
    
  function addRequest(){
    const formData = new FormData();
    if(selectedFile){
        formData.append("file", selectedFile);
    }else{
        return;
    }
    if(requestTitle.trim() === ''){
        return;
    }
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/${subjectId}/${requestTitle}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: formData,
    })
    .then((response: Response) => {
      if (!(response.status === 201)) {
        throw new Error("Network response was not ok");
      }
      getRequests();
    })
    .catch((error:Error)=>{
      console.log(error);
    })
  }




  function getRequests(){
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/byStudent`, {
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
    .then((requests:Request[])=>{
      setRequeststList(requests);
      console.log(requests);
    })
    .catch((error:Error)=>{
      console.log(error);
    })
  }

  function getSubjects(){
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subjects`, {
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
    .then((subjects:Subject[])=>{
      setSubjectList(subjects);
      console.log(subjects);
    })
    .catch((error:Error)=>{
      console.log(error);
    })
  }



  useEffect(()=>{
    getRequests();
    getSubjects();
  },[])



  useEffect(() => {
    if (isOpen && inputRef.current) {
        inputRef.current.focus();
    }
}, [isOpen]);

  const openModal = () => {
    setSubjectId(subjectList[0].id);
      setIsOpen(true);
  };

  const closeModal = () => {
    setrequestTitle('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setrequestTitle(e.target.value);
  };

  const handleSubmit = () => {
        addRequest();
        closeModal();
  };

//   function modify(id:number,name:string){
//     setrequestTitle(name);
//     openModal();
//   }


  return <StyledRequestsStudent>
    {/* plus */}
    <div className="flex flex-col items-center justify-center plus icon">
    <svg xmlns="http://www.w3.org/2000/svg" onClick={openModal} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>
<div className="flex items-center mb-4">
    <input id="default-checkbox" type="checkbox" checked={openedRequests}
            onChange={handleCheckboxChangeOpen} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"/>
    <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 mr-4">Aperte</label>
    <input id="default-checkbox" type="checkbox" checked={closedRequests}
            onChange={handleCheckboxChangeClose} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"/>
    <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Chiuse</label>
</div>
</div>
<div className="subjects">
  <ul className="list-disc">
    {requestsList.map((request:Request,i:number) =>(
      (((request.requestState === 'OPEN' && openedRequests))||((request.requestState === 'CLOSED' && closedRequests))) &&
      (<li key={i} className="flex justify-between">
        {request.title}
        <div className="flex">
          {request.requestState === 'OPEN' ? 'APERTA':'CHIUSA'}&nbsp;
        <svg onClick={()=>{router.push(`/student_area/requests/${request.id}`)}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 icon">
  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
</svg>

  </div>
      </li>)
    ))
    }
</ul>
</div>
            {/* Modal */}
            {isOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
                  
                    <div className="absolute bg-white p-6 rounded-lg shadow-xl">
                      <div className="flex justify-end">
                    <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-6 h-6 icon"
                    onClick={closeModal}
                    >
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg></div>
                        {/* Titolo */}
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold">Aggiungi Richiesta</h2>
                        </div>
                        <div className="flex mb-4">
<select value={subjectId} onChange={(e)=>{setSubjectId(parseInt(e.target.value))}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
  {subjectList.map((subject:Subject)=>(<option key={subject.id} value={subject.id}>{subject.name}</option>))}
</select>

</div>

                        {/* Campo di input */}
                        <input
                            type="text"
                            className="border border-gray-300 rounded-md px-3 py-2 mb-3 w-full"
                            placeholder="Nome richiesta..."
                            value={requestTitle}
                            onChange={handleInputChange}
                            autoFocus
                            required
                        />
                        
<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >File</label>
<input className="block mb-3 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" onChange={handleFileChange}/>


                        {/* Bottone di submit */}
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={handleSubmit}
                        >
                            Aggiungi
                        </button>
                    </div>
                </div>
            )}
        
</StyledRequestsStudent>;
}