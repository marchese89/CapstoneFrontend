"use client";

import { useEffect, useRef, useState } from "react";
import { Request, Solution } from "../types";
import styled from "styled-components";
import { useRouter } from "next/navigation";

type RquestParam = {
  requestId: number;
};

const StyledSingleRequestTeacher = styled.div`
  background-color: aliceblue;
  padding-bottom: 3em;
`;

const SingleRequestTeacher: React.FC<RquestParam> = ({ requestId }) => {
  const [request, setRequest] = useState<Request>();
  const [fileContent, setFileContent] = useState<string>();
  const [fileContentType, setFileContentType] = useState<string>();
  const [fileSolutionContent, setFileSolutionContent] = useState<string>();
  const [fileSolutionType, setFileSolutionType] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [solutionPrice, setSolutionPrice] = useState<string>("");
  const [solution, setSolution] = useState<Solution>();
  const [fileInvoice, setFileInvoice] = useState<string>();
  const [typeInvoice, setTypeInvoice] = useState<string>();
  const [isOpenMessage, setIsOpenMessage] = useState<boolean>(false);
  const [responseHeader, setResponseHeader] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const router = useRouter();
  useEffect(() => {
    getSolution();
  }, [request]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  function getFile(
    pathname: string,
    setFile: (url: string) => void,
    setType: (type: string) => void
  ) {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ path: pathname }),
    })
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("Errore nella richiesta: " + response.statusText);
        }
        const type = response.headers.get("content-type");
        if (type) {
          setType(type);
        }
        return response.blob();
      })
      .then((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        setFile(url);
      })
      .catch((error) => {
        console.error("Errore durante il recupero del file:", error);
      });
  }

  function getRequest() {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/teacher/${requestId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    )
      .then((response: Response) => {
        if (!(response.status === 200)) {
          if (response.status === 500) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userType");
            router.push("/");
          } else {
            throw new Error("Network response was not ok");
          }
        }
        return response.json();
      })
      .then((req: Request) => {
        setRequest(req);
        getFile(req.questionUrl, setFileContent, setFileContentType);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  function getSolution() {
    if (!requestId) {
      return;
    }
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/solutions/getByRequestIdAndTeacher/${requestId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    )
      .then((response: Response) => {
        if (!(response.status === 200)) {
          if (response.status === 500) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userType");
            router.push("/");
          } else {
            throw new Error("Network response was not ok");
          }
        }
        return response.json();
      })
      .then((sol: Solution) => {
        setSolution(sol);
        getFile(sol.solutionUrl, setFileSolutionContent, setFileSolutionType);
        if (request && sol.state === "ACCEPTED") {
          getFile(
            request.invoice.invoiceFileUrl,
            setFileInvoice,
            setTypeInvoice
          );
        }
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getRequest();
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {
    addSolution();
    closeModal();
  };

  function addSolution() {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    } else {
      return;
    }
    if (solutionPrice == "") {
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/solutions/${requestId}/${
        parseInt(solutionPrice) * 100
      }`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      }
    )
      .then((response: Response) => {
        if (!(response.status === 201)) {
          if (response.status === 400) {
            setResponseHeader("Invio Richiesta Fallito");
            setResponseMessage(
              "Ci sono stati problemi con il caricamento del file"
            );
            setIsOpenMessage(true);
          } else {
            throw new Error("Network response was not ok");
          }
        }
        getSolution();
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;
    setSelectedFile(fileList[0]);
  };

  function handleCloseMessage() {
    setIsOpenMessage(false);
  }

  return (
    <StyledSingleRequestTeacher>
      <div className="text-center">
        <h2 className="text-center mt-4">{request?.title}</h2>
      </div>
      <div>
        <div className="flex justify-center items-center">
          {fileContent && (
            <embed
              className="mt-4"
              src={
                fileContent +
                `${fileContentType === "application/pdf" ? "#view=FitH" : ""}`
              }
              type={fileContentType}
            />
          )}
        </div>
        <div>
          <div className="flex flex-col justify-center items-center">
            {fileSolutionContent && (
              <>
                <h2 className="text-center mt-4">Soluzione</h2>
                <embed
                  className="mt-4"
                  src={
                    fileSolutionContent +
                    `${
                      fileSolutionType === "application/pdf" ? "#view=FitH" : ""
                    }`
                  }
                  type={fileSolutionType}
                />
                <div className="mt-4">
                  <span>Prezzo: {solution && solution.price / 100}&euro;</span>
                </div>
                <div className="mt-4 mb-6">
                  {solution && solution.state === "ACCEPTED" && (
                    <span className="rounded p-2 bg-green-500 text-white">
                      Soluzione Accettata
                    </span>
                  )}
                  {solution && solution.state === "REJECTED" && (
                    <span className="rounded p-2 bg-red-500 text-white">
                      Soluzione Rifiutata
                    </span>
                  )}
                </div>
                {fileInvoice && typeInvoice && (
                  <>
                    <h2>
                      <strong>Fattura</strong>
                    </h2>
                    <embed
                      className="mt-4"
                      src={
                        fileInvoice +
                        `${
                          typeInvoice === "application/pdf" ? "#view=FitH" : ""
                        }`
                      }
                      type={typeInvoice}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {!fileSolutionContent && request && request.requestState === "OPEN" && (
        <div className="text-center mb-6">
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={openModal}
          >
            Carica Soluzione
          </button>
        </div>
      )}
      {request && request.requestState === "CLOSED" && (
        <div className="flex items-center justify-center">
          <h3 className="rounded p-2 mt-4 bg-red-500 inline-block text-white">
            Richiesta Chiusa
          </h3>
        </div>
      )}

      {isOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute bg-white p-6 rounded-lg shadow-xl">
            <div className="flex justify-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 icon"
                onClick={closeModal}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="mb-4 text-center">
              <h2 className="text-lg font-semibold">Carica Soluzione</h2>
            </div>

            <div className="text-center">
              <div className="flex justify-center items-center">
                <h2 className="flex mr-4">Prezzo</h2>
                <input
                  type="number"
                  className="border border-gray-300 rounded-md px-3 py-2 mb-0"
                  placeholder="prezzo"
                  value={solutionPrice}
                  onChange={(e) => {
                    setSolutionPrice(e.target.value);
                  }}
                  required
                  style={{ width: "80px" }}
                />
                &nbsp;&nbsp;&euro;
              </div>
            </div>

            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              File
            </label>
            <input
              className="block mb-3 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              onChange={handleFileChange}
            />

            <div className="text-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleSubmit}
              >
                Aggiungi
              </button>
            </div>
          </div>
        </div>
      )}
      {isOpenMessage && (
        <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute bg-white p-6 rounded-lg shadow-xl">
            <div className="flex justify-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 icon"
                onClick={handleCloseMessage}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="mb-4 text-center">
              <h2 className="text-lg font-semibold">{responseHeader}</h2>
            </div>
            <div>{responseMessage}</div>
            <div className="text-center">
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleCloseMessage}
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </StyledSingleRequestTeacher>
  );
};

export default SingleRequestTeacher;
