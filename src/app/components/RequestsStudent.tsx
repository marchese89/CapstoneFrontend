"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Request, Subject } from "../types";
import { format } from "date-fns";
const StyledRequestsStudent = styled.div`
  text-align: center;
  margin-top: 1em;
  .plus {
    &:hover {
      cursor: pointer;
    }
  }
  .subjects {
    display: flex;
    justify-content: center;
    height: 330px;
  }
  .icon {
    &:hover {
      cursor: pointer;
    }
  }
  input[type="checkbox"]:focus {
    outline: none;
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
    }
  }
  .link.selected {
    font-weight: bold;
    background-color: darkslategrey;
  }
  .requests-table {
    width: 60%;
  }
  @media screen and (max-width: 640px) {
    .requests-table {
      display: none;
    }
    .subjects {
      height: 0px;
    }

    .subjects-mobile {
      display: block;
      width: 90%;
      margin-left: auto;
      margin-right: auto;
    }
  }
  @media screen and (min-width: 640px) and (max-width: 768px) {
    .requests-table {
      margin-left: 3em;
      margin-right: 3em;
    }
  }
  /* and (max-width: 768px) */

  @media screen and(min-width: 768px) {
    .subjects-mobile {
      display: none;
    }
  }
  .request {
    min-width: 300px;
    background-color: darkcyan;
    margin: 0.4em;
    padding: 0.5em;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    background-image: linear-gradient(
      to bottom,
      rgba(0, 150, 200, 1),
      rgba(255, 255, 255, 0)
    );
  }
  .req-open {
    background-color: lightgreen;
  }
  .req-closed {
    background: lightcoral;
  }
  .req-open,
  .req-closed {
    color: white;
    padding: 0.2em;
    border-radius: 5px;
  }
`;

export default function RequestsStudent(): JSX.Element {
  const [requestsList, setRequeststList] = useState<Request[]>([]);
  const [subjectList, setSubjectList] = useState<Subject[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenMessage, setIsOpenMessage] = useState<boolean>(false);
  const [responseHeader, setResponseHeader] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [requestTitle, setrequestTitle] = useState<string>("");
  const [subjectId, setSubjectId] = useState<number>(-1);
  const [selectedFile, setSelectedFile] = useState<File>();
  const router = useRouter();
  const [openedRequests, setOpenedRequests] = useState(true);
  const [closedRequests, setclosedRequests] = useState(true);

  const [maxPage, setMaxPage] = useState(1);
  const [pages, setPages] = useState<number[]>();
  const [selectedPage, setSelectedPage] = useState<string | number>(0);
  const [sortDirection, setSortDirection] = useState<string>("desc");

  const handleCheckboxChangeOpen = () => {
    setOpenedRequests(!openedRequests);
  };
  const handleCheckboxChangeClose = () => {
    setclosedRequests(!closedRequests);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;
    setSelectedFile(fileList[0]);
  };

  function addRequest() {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    } else {
      return;
    }
    if (requestTitle.trim() === "") {
      return;
    }
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/${subjectId}/${requestTitle}`,
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
        const sp = Number(selectedPage);
        if (!isNaN(sp)) {
          getRequests(sp);
        }
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  function getRequests(page: number) {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/byStudent?page=${page}&size=5&direction=${sortDirection}&orderBy=date`,
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
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((requestsPage) => {
        const totPages = requestsPage.totalPages;
        setMaxPage(requestsPage.totalPages - 1);
        const array = [];
        for (let i = 0; i < totPages && i <= 4; i++) {
          array.push(i);
        }
        setPages(array);
        setRequeststList(requestsPage.content);
        console.log(requestsPage);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  function getSubjects() {
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
      .then((subjects: Subject[]) => {
        setSubjectList(subjects);
        console.log(subjects);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    const sp = Number(selectedPage);
    if (!isNaN(sp)) {
      getRequests(sp);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortDirection]);

  useEffect(() => {
    getSubjects();
  }, []);

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
    setrequestTitle("");
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setrequestTitle(e.target.value);
  };

  const handleSubmit = () => {
    closeModal();
    addRequest();
  };

  function handleCloseMessage() {
    setIsOpenMessage(false);
  }

  function limitText(text: string): string {
    if (text.length <= 20) {
      return text;
    } else {
      return text.substring(0, 20) + "...";
    }
  }

  return (
    <StyledRequestsStudent>
      {/* plus */}
      <div className="flex flex-col items-center justify-center plus icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          onClick={openModal}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        <div className="flex items-center mb-4">
          <input
            name="opened"
            type="checkbox"
            checked={openedRequests}
            onChange={handleCheckboxChangeOpen}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
          />
          <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 mr-4">
            Aperte
          </label>
          <input
            name="closed"
            type="checkbox"
            checked={closedRequests}
            onChange={handleCheckboxChangeClose}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
          />
          <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Chiuse
          </label>
          &nbsp;|Ordina per data
          {sortDirection === "desc" && (
            <svg
              onClick={() => setSortDirection("asc")}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
              />
            </svg>
          )}
          {sortDirection === "asc" && (
            <svg
              onClick={() => setSortDirection("desc")}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="subjects flex flex-column">
        <table className="rounded overflow-hidden requests-table h-1">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Titolo
              </th>
              <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Materia
              </th>
              <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Stato
              </th>
              <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Dettagli
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {requestsList.map(
              (request: Request, i: number) =>
                ((request.requestState === "OPEN" && openedRequests) ||
                  (request.requestState === "CLOSED" && closedRequests)) && (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center whitespace-nowrap">
                      {limitText(request.title)}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center whitespace-nowrap">
                      {limitText(request.subject.name)}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center whitespace-nowrap">{` ${format(
                      request.date,
                      "dd/MM/yyyy HH:mm:ss"
                    )}`}</td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center whitespace-nowrap">
                      <span
                        className={`${
                          request.requestState === "OPEN"
                            ? "req-open"
                            : "req-closed"
                        }`}
                      >
                        {request.requestState === "OPEN" ? "APERTA" : "CHIUSA"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center whitespace-nowrap">
                      <div className="flex justify-center">
                        <svg
                          onClick={() => {
                            router.push(`/student_area/requests/${request.id}`);
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 icon"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                          />
                        </svg>
                      </div>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
      <div className="subjects-mobile hidden">
        <div className="list-disc">
          {requestsList.map(
            (request: Request, i: number) =>
              ((request.requestState === "OPEN" && openedRequests) ||
                (request.requestState === "CLOSED" && closedRequests)) && (
                <div key={i} className="flex justify-between flex-col request">
                  <div className="flex flex-col">
                    <strong>Titolo</strong>
                    {limitText(request.title)}
                  </div>
                  <div className="flex flex-col">
                    <strong>Materia</strong>
                    {limitText(request.subject.name)}
                  </div>
                  <div className="flex justify-center flex-col">
                    <strong>Data Richiesta</strong>
                    {format(request.date, "dd/MM/yyyy HH:mm:ss")}
                  </div>
                  <div className="flex justify-center flex-col items-center">
                    <strong>Stato Richiesta</strong>
                    <span
                      className={`${
                        request.requestState === "OPEN"
                          ? "req-open"
                          : "req-closed"
                      }`}
                    >
                      {request.requestState === "OPEN" ? "APERTA" : "CHIUSA"}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <svg
                      onClick={() => {
                        router.push(`/teacher_area/requests/${request.id}`);
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 icon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                      />
                    </svg>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
      <div className="flex justify-center mt-4">
        {pages &&
          pages.map((page, i) => (
            <span
              key={i}
              className={`link ${
                selectedPage == page ? "selected" : ""
              } mx-1 mr-4 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
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
              if (!isNaN(sp)) {
                getRequests(sp);
              }
            }}
          >
            Vai
          </button>
          <span className="mx-2">{`max ${maxPage}`}</span>
        </span>
      </div>
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
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Aggiungi Richiesta</h2>
            </div>
            <div className="flex mb-4">
              <select
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(parseInt(e.target.value));
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                {subjectList.map((subject: Subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 mb-3 w-full"
              placeholder="Nome richiesta..."
              value={requestTitle}
              onChange={handleInputChange}
              autoFocus
              required
            />

            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              File
            </label>
            <input
              className="block mb-3 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              onChange={handleFileChange}
            />

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmit}
            >
              Aggiungi
            </button>
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
    </StyledRequestsStudent>
  );
}
