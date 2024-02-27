"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const StyledSubjects = styled.div`
  background-color: aliceblue;

  text-align: center;

  .plus {
    &:hover {
      cursor: pointer;
    }
  }
  .subjects {
    display: flex;
    justify-content: center;

    ul {
      list-style-type: none;
      li {
        min-width: 300px;
        background-color: aliceblue;
        margin: 0.4em;
        padding: 0.5em;
        border-radius: 5px;
      }
    }
  }
  .icon {
    &:hover {
      cursor: pointer;
    }
  }
`;

type Subject = {
  id: number;
  name: string;
};

export default function Subjects(): JSX.Element {
  const [subjectList, setSubjectList] = useState<Subject[]>([]);
  const [subjectNoList, setSubjectNoList] = useState<Subject[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function addSubject() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subjects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ name: subjectName }),
    })
      .then((response: Response) => {
        if (!(response.status === 201)) {
          throw new Error("Network response was not ok");
        }
        getSubjects();
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  function addSubjectAlreadyExists() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subjects/add/${subjectId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response: Response) => {
        if (!(response.status === 200)) {
          throw new Error("Network response was not ok");
        }
        getSubjects();
        getNoSubjects();
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  function modifySubject() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subjects/${subjectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ name: subjectName }),
    })
      .then((response: Response) => {
        if (!(response.status === 200)) {
          throw new Error("Network response was not ok");
        }
        getSubjects();
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  function getSubjects() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subjects/byTeacher`, {
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
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  function getNoSubjects() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subjects/byNoTeacher`, {
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
      .then((subjectsNo: Subject[]) => {
        setSubjectNoList(subjectsNo);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getSubjects();
    getNoSubjects();
  }, []);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [subjectName, setsubjectName] = useState<string>("");
  const [subjectId, setSubjectId] = useState<number>(-1);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setsubjectName("");
    setSubjectId(-1);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsubjectName(e.target.value);
  };

  const handleSubmit = () => {
    if (subjectId === -1) {
      addSubject();
    } else {
      modifySubject();
    }

    closeModal();
  };

  function modify(id: number, name: string) {
    setsubjectName(name);
    setSubjectId(id);
    openModal();
  }

  return (
    <StyledSubjects>
      {/* plus */}
      <div className="flex flex-col items-center justify-center plus">
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
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Aggingi Materie già create
        </label>
        <div className="flex">
          <select
            value={subjectId}
            onChange={(e) => {
              setSubjectId(parseInt(e.target.value));
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value={-1}></option>
            {subjectNoList.map((subject: Subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <button
            className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              addSubjectAlreadyExists();
            }}
          >
            {`Aggiungi`}
          </button>
        </div>
      </div>
      <div className="subjects pb-8">
        <ul className="list-disc">
          {subjectList.map((subject: Subject, i: number) => (
            <li key={i} className="flex justify-between">
              {subject.name}
              <div className="flex">
                <svg
                  onClick={() => {
                    modify(subject.id, subject.name);
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
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </div>
            </li>
          ))}
        </ul>
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
              <h2 className="text-lg font-semibold">
                {subjectId === -1 ? `Aggiungi Materia` : `Modifica Materia`}
              </h2>
            </div>

            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 mb-3 w-full"
              placeholder="Nome materia..."
              value={subjectName}
              onChange={handleInputChange}
            />

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmit}
            >
              {subjectId === -1 ? `Aggiungi` : `Modifica`}
            </button>
          </div>
        </div>
      )}
    </StyledSubjects>
  );
}
