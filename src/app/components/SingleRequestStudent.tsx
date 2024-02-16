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
      .stars a{
	opacity:20%;
	cursor: pointer;
}
.feed a{
  opacity:10%;
}
.stars:hover a{
	opacity:100%;
}
.stars a:hover{
	opacity:100%;
}
.stars a:hover ~ a{
	opacity:20%;
}

`;

 const SingleRequestStudent:React.FC<StudentParam> = ({requestId})=>{

    const [request,setRequest] = useState<Request>();
    const [fileRequest, setFileRequest] = useState<string>();
    const [fileSolution,setFileSolution] = useState<string>();
    const [solutionList,setSolutionList] = useState<Solution[]>();
    const [typeRequest, setTypeRequest] = useState<string>();
    const [typeSolution,setTypeSolution] = useState<string>();
    const [fileInvoice,setFileInvoice] = useState<string>();
    const [typeInvoice,setTypeInvoice] = useState<string>();
    
    const router = useRouter();
    const dispatch = useDispatch();

    function getFile(pathname:string,setFile:(url:string)=>void,setType:(type:string)=>void){

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
            const type = response.headers.get('content-type');
            if(type){
              setType(type);
            }
            return response.blob();
        })
        .then((blob:Blob) => {
              const url = URL.createObjectURL(blob);
              // setFileContent(url);
              setFile(url);
            
        })
        .catch(error => {
            console.error('Errore durante il recupero del file:', error);
        });
    }

    function getSolutionList(){
      if(!requestId){
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
            })
            .catch((error:Error)=>{
              console.log(error);
            })
    }


    function getRequest(){
        
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
                getFile(req.questionUrl,setFileRequest,setTypeRequest);
                if(req.requestState === "OPEN"){
                  getSolutionList();
                }else{
                  getFile(req.solutionUrl,setFileSolution,setTypeSolution)
                  getFile(req.invoice.invoiceFileUrl,setFileInvoice,setTypeInvoice);
                }
                console.log(req);
            })
            .catch((error:Error)=>{
              console.log(error);
            })
    }

    function sendFeedBack(score:number){
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          requestId: requestId,
          score:score
        })
      })
      .then((response: Response) => {
        if (!(response.status === 201)) {
          throw new Error("Network response was not ok");
        }
        getRequest();
      })
      .catch((error:Error)=>{
        console.log(error);
      })
    }

    useEffect(()=>{
        getRequest();
    },[])

    return (<StyledSingleRequestStudent>
    <h2 className="text-center mt-4">{request?.title} | <strong>Materia:</strong> {request?.subject.name}</h2>
        <div>
        <div className="flex justify-center items-center">
            {(fileRequest && fileRequest && typeRequest) && (
                <embed className="mt-4"
                    src={fileRequest+`${typeRequest === 'application/pdf'?'#view=FitH':''}`}
                    type={typeRequest}
                    style={{width: "70%",borderRadius:"7px",height: "700px"}}
                />
            )}
        </div>
        </div>
        <div className="text-center flex flex-col items-center mb-4">
        <h2 className="text-center mt-4"><strong>{
        (request && request.requestState === "OPEN") ? 'Soluzioni': 'Soluzione'}</strong></h2>
        <ul className="list-disc">
    {solutionList && solutionList.length > 0 && (solutionList.map((solution:Solution,i:number) =>(
      <li key={i} className="flex justify-between">
        <div className="flex feed">
        {solution.teacher.name}&nbsp;{solution.teacher.surname}
        {' | feedback: '}
            <a style={solution.teacher.feedback && solution.teacher.feedback > 0 ?{opacity: "100%"}:{}}
                >⭐</a>
            <a style={solution.teacher.feedback && solution.teacher.feedback > 1 ?{opacity: "100%"}:{}}
                >⭐</a>
            <a style={solution.teacher.feedback && solution.teacher.feedback > 2 ?{opacity: "100%"}:{}}
            >⭐</a>
            <a style={solution.teacher.feedback && solution.teacher.feedback > 3 ?{opacity: "100%"}:{}}
                >⭐</a>
            <a style={solution.teacher.feedback && solution.teacher.feedback > 4 ?{opacity: "100%"}:{}}
                >⭐</a>
        </div>
        <div className="flex">Prezzo: {solution.price/100}&euro;&nbsp;&nbsp;paga&nbsp;&nbsp;
        <svg onClick={()=>{
          dispatch(addPaymentData(solution.id,requestId,solution.price));
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
{(request && request.solutionUrl && fileSolution && typeSolution) && (<>
  <embed className="mt-4"
  src={fileSolution+`${typeSolution === 'application/pdf'?'#view=FitH':''}`}
  type={typeSolution}
  style={{width: "70%",borderRadius:"7px",height: "700px"}}

/>
<h2 className="mt-4">Feedback insegnante</h2>
<div className="stars" id="stars">
            <a style={request.feedback && request.feedback.score > 0 ?{opacity: "100%"}:{}}
                onClick={()=>{sendFeedBack(1)}}>⭐</a>
            <a style={request.feedback && request.feedback.score > 1 ?{opacity: "100%"}:{}}
                onClick={()=>{sendFeedBack(2)}}>⭐</a>
            <a style={request.feedback && request.feedback.score > 2 ?{opacity: "100%"}:{}}
            onClick={()=>{sendFeedBack(3)}}>⭐</a>
            <a style={request.feedback && request.feedback.score > 3 ?{opacity: "100%"}:{}}
                onClick={()=>{sendFeedBack(4)}}>⭐</a>
            <a style={request.feedback && request.feedback.score > 4 ?{opacity: "100%"}:{}}
                onClick={()=>{sendFeedBack(5)}}>⭐</a>
        </div>
</>
)}
{(fileInvoice && typeInvoice) &&(
  <>
  <h2><strong>Fattura</strong></h2>
  <embed className="mt-4"
  src={fileInvoice+`${typeInvoice === 'application/pdf'?'#view=FitH':''}`}
  type={typeInvoice}
  style={{width: "70%",borderRadius:"7px",height: "700px"}}

/>
  </>
)}
</div>
    </StyledSingleRequestStudent>);
}

export default SingleRequestStudent;