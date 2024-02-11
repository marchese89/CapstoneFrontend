"use client"

import { useEffect, useState } from "react";
import { Request, Solution } from "../types";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { addPaymentData } from "../redux/actions";

type StudentParam= {
    requestId: number
}

const StyledSingleRequestStudent = styled.div`
ul{ 
        width: 40%;
        list-style-type: none;
        li{
          min-width: 300px;
          background-color: aliceblue;
          margin: 0.4em;
          padding: 0.5em;
          border-radius: 5px;
          
        }
      }
`;

 const SingleRequestStudent:React.FC<StudentParam> = ({requestId})=>{

    const [request,setRequest] = useState<Request>();
    const [fileContent, setFileContent] = useState<string>();
    const [solutionList,setSolutionList] = useState<Solution[]>();
    const router = useRouter();
    const dispatch = useDispatch();

    function getFile(pathname:string){

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/file`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({path:pathname}),
          })
        .then((response:Response) => {
            if (!response.ok) {
                throw new Error('Errore nella richiesta: ' + response.statusText);
            }
            return response.blob();
        })
        .then((blob:Blob) => {
              const url = URL.createObjectURL(blob);
              setFileContent(url);
            
        })
        .catch(error => {
            console.error('Errore durante il recupero del file:', error);
        });
    }

    function getSolutionList(){
      console.log("chiamo get solution list");
      if(!requestId){
        console.log("esco subito da get solution list");
        return;
      }
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solutions/getByRequestId/${requestId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            })
            .then((response: Response) => {
              if (!(response.status === 200)) {
                console.log("risposta NON OK da get solution");
                throw new Error("Network response was not ok");
              }
              console.log("risposta ok da get solution list");
              return response.json();
            })
            .then((sol:Solution[])=>{
                setSolutionList(sol);
                console.log(sol);
                // getFile(sol.solutionUrl,setFileSolutionContent);
            })
            .catch((error:Error)=>{
              console.log(error);
            })
    }

    function getRequest(){
      if(request){
        return;
      }
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/student/${requestId}`, {
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
            .then((req:Request)=>{
                setRequest(req);
                getFile(req.questionUrl);
                console.log(req);
            })
            .catch((error:Error)=>{
              console.log(error);
            })
    }

    useEffect(()=>{
        getRequest();
        getSolutionList();
    },[])

    return (<StyledSingleRequestStudent>
    <h2 className="text-center mt-4">{request?.title}</h2>
        <div>
        <div className="flex justify-center items-center">
            {fileContent && (
                <img className="mt-4"
                    src={fileContent}
                    // title="File Viewer"
                    style={{width: "70%",borderRadius:"7px"}}
                    alt="question image"
                />
            )}
        </div>
        </div>
        <div className="text-center flex flex-col items-center mb-4">
        <h2 className="text-center mt-4">Soluzioni</h2>
        <ul className="list-disc">
    {solutionList && (solutionList.map((solution:Solution,i:number) =>(
      <li key={i} className="flex justify-between">
        <div>{solution.teacher.name}&nbsp;{solution.teacher.surname}</div>
        <div className="flex">Prezzo: {solution.price/100}&euro;&nbsp;&nbsp;paga&nbsp;&nbsp;
        <svg onClick={()=>{
          dispatch(addPaymentData(solution.id,solution.price));
          router.push("/payment");
        }
          } xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
</svg>


  </div>
      </li>
    ))
    )}
</ul>
</div>
    </StyledSingleRequestStudent>);
}

export default SingleRequestStudent;