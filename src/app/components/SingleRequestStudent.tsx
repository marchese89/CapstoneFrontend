"use client"

import { useEffect, useState } from "react";
import { Request } from "../types";

type StudentParam= {
    requestId: number
}

 const SingleRequestStudent:React.FC<StudentParam> = ({requestId})=>{

    const [request,setRequest] = useState<Request>();
    const [fileContent, setFileContent] = useState<string>();

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
    },[])

    return (<>
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
    </>);
}

export default SingleRequestStudent;