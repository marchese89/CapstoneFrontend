"use client";

import { usePathname, useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAction, logoutAction } from "../redux/actions";

const StyledHeader = styled.div`
  header {
    background-color: rgb(0, 150, 150);
    background-image: linear-gradient(
      to bottom,
      rgba(0, 150, 200, 1),
      rgba(255, 255, 255, 0)
    );
    color: white;
  }
  .mobile-menu {
    background-color: aliceblue !important;
  }
`;

export default function Header(): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const isLogged = useSelector((state: any) => state.login.isLogged);
  const dispatch = useDispatch();

  function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    dispatch(logoutAction());
    router.push("/");
    setMobileMenuOpen(false);
  }

  function gotoPersonalArea() {
    if (localStorage.getItem("userType") === "TEACHER") {
      router.push("/teacher_area");
      setMobileMenuOpen(false);
    } else if (localStorage.getItem("userType") === "STUDENT") {
      router.push("/student_area");
      setMobileMenuOpen(false);
    }
  }

  function gotoRegister() {
    router.push("/register");
    setMobileMenuOpen(false);
  }

  function gotoLogin() {
    router.push("/login");
    setMobileMenuOpen(false);
  }

  useEffect(() => {
    if (localStorage.getItem("userType") !== null) {
      dispatch(loginAction(localStorage.getItem("userType")));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledHeader>
      <header className="">
        <div className="text-center">
          <h1
            onClick={() => {
              router.push("/");
            }}
          >
            Supporto Studenti
          </h1>
        </div>
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {!isLogged && (
              <>
                <a
                  href="#"
                  className="mr-4 text-sm font-semibold leading-6 text-gray-900 login-register"
                  onClick={gotoRegister}
                >
                  Registrati <span aria-hidden="true"></span>
                </a>

                <a
                  href="#"
                  className="text-sm font-semibold leading-6 text-gray-900"
                  onClick={gotoLogin}
                >
                  Log in <span aria-hidden="true"></span>
                </a>
              </>
            )}
            {isLogged && (
              <>
                <a
                  href="#"
                  className="text-sm font-semibold leading-6 text-gray-900 login-register mr-4"
                  onClick={gotoPersonalArea}
                >
                  Area Personale (
                  {localStorage.getItem("userType") === "TEACHER"
                    ? "Insegnante"
                    : "Studente"}
                  )<span aria-hidden="true"></span>
                </a>

                <a
                  href="#"
                  className="text-sm font-semibold leading-6 text-gray-900"
                  onClick={logout}
                >
                  Logout <span aria-hidden="true"></span>
                </a>
              </>
            )}
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden mobile-menu"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-teal-50 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 pt-16 pb-4 px-2">
                  <a
                    className="-mx-3 block cursor-pointer rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => {
                      router.push("/");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Home
                  </a>
                </div>
                <div className="pt-4">
                  {isLogged && (
                    <>
                      <a
                        href="#"
                        onClick={gotoPersonalArea}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Area Personale <span aria-hidden="true"></span>
                      </a>

                      <a
                        href="#"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={logout}
                      >
                        Logout <span aria-hidden="true"></span>
                      </a>
                    </>
                  )}
                  {!isLogged && (
                    <>
                      <a
                        href="#"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={gotoRegister}
                      >
                        Registrati <span aria-hidden="true"></span>
                      </a>

                      <a
                        href="#"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={gotoLogin}
                      >
                        Log in <span aria-hidden="true"></span>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </StyledHeader>
  );
}
