"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { loginAction } from "../redux/actions";

const StyledLogin = styled.div`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    20% {
      transform: translateX(-10px);
    }
    40% {
      transform: translateX(10px);
    }
    60% {
      transform: translateX(-10px);
    }
    80% {
      transform: translateX(10px);
    }
    100% {
      transform: translateX(0);
    }
  }

  .shake-element {
    animation: shake 0.5s ease-in-out;
    input {
      background-color: salmon;
    }
  }
`;
type UserLoginDTO = {
  email: string;
  password: string;
};

type TokenDTO = {
  token: string;
  role: string;
};

export default function Login(): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();
  const [modalPasswordRecover, seModalPasswordRecover] = useState<boolean>(
    false
  );
  const [email, setEmail] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isShaked, setIsShaked] = useState<boolean>(false);

  function handlePasswordRecover() {
    seModalPasswordRecover(false);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/recoverPass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((response: Response) => {
        if (!(response.status === 200)) {
          setEmail("");
          if (response.status === 404) {
            throw new Error("notFound");
          } else {
            if (response.status === 500) {
              localStorage.removeItem("authToken");
              localStorage.removeItem("userType");
              router.push("/");
            } else {
              throw new Error("Network response was not ok");
            }
          }
        }
        setEmail("");
        setModalTitle("Password recuperata");
        setModalMessage(
          "È stata creata una nuova password che ti è stata inviata via email"
        );
        setIsOpen(true);
        setTimeout(() => {
          setIsOpen(false);
        }, 1500);
      })

      .catch((error: Error) => {
        if (error.message === "notFound") {
          setModalTitle("Password NON recuperata");
          setModalMessage(
            "L'email che hai inserito non è presente nel database"
          );
          setIsOpen(true);
          setTimeout(() => {
            setIsOpen(false);
          }, 1500);
        } else {
          setModalTitle("Password NON recuperata");
          setModalMessage(
            "Ci sono stati problemi nel recupero della tua password"
          );
          setIsOpen(true);
          setTimeout(() => {
            setIsOpen(false);
          }, 1500);
        }
      });
  }

  const [user, setUser] = useState<UserLoginDTO>({
    email: "",
    password: "",
  });

  function handleInputChangeUser(e: ChangeEvent<HTMLInputElement>) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUser({
      email: "",
      password: "",
    });
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response: Response) => {
        if (!(response.status === 200)) {
          if (response.status === 400 || response.status === 401) {
            setIsShaked(true);
            setModalTitle("Login Fallito");
            setModalMessage(
              "Le credenziali che hai inserito non sono corrette"
            );
            setIsOpen(true);
            setTimeout(() => {
              setIsOpen(false);
              setIsShaked(false);
            }, 2000);
          } else {
            if (response.status === 500) {
              localStorage.removeItem("authToken");
              localStorage.removeItem("userType");
              router.push("/");
            } else {
              throw new Error("Network response was not ok");
            }
          }
        }
        setIsShaked(false);
        return response.json();
      })
      .then((loginResponse: TokenDTO) => {
        localStorage.setItem("authToken", loginResponse.token);
        if (loginResponse.role === "STUDENT") {
          localStorage.setItem("userType", "STUDENT");
          dispatch(loginAction("STUDENT"));
          router.push("/student_area");
        } else if (loginResponse.role === "TEACHER") {
          localStorage.setItem("userType", "TEACHER");
          dispatch(loginAction("TEACHER"));
          router.push("/teacher_area");
        }
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  return (
    <StyledLogin>
      <div
        className={`mt-10 sm:mx-auto sm:w-full sm:max-w-sm outer-div mx-8 shake ${
          isShaked ? ` shake-element` : ``
        }`}
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={user.email}
                onChange={handleInputChangeUser}
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                  onClick={() => {
                    seModalPasswordRecover(true);
                  }}
                >
                  Password dimenticata?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={user.password}
                onChange={handleInputChangeUser}
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Entra
            </button>
          </div>
        </form>
      </div>
      {modalPasswordRecover && (
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
                onClick={() => {
                  seModalPasswordRecover(false);
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-center">
                Recupera Password
              </h2>
            </div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-center">
              Email
            </label>
            <input
              type="email"
              className="border border-gray-300 rounded-md px-3 py-2 mb-3 w-full"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              autoFocus
            />

            <div className="text-center">
              <button
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handlePasswordRecover}
              >
                Recupera
              </button>
            </div>
          </div>
        </div>
      )}
      {isOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute bg-white p-6 rounded-lg shadow-xl">
            <div>
              {/* Title */}
              <div className="mb-4 text-center">
                <h2 className="text-lg font-semibold text-center">
                  {modalTitle}
                </h2>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {modalMessage}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </StyledLogin>
  );
}
