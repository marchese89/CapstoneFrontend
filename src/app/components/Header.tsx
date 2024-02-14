"use client"

import { usePathname,useRouter } from "next/navigation";
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAction, logoutAction } from "../redux/actions";


const StyledHeader = styled.div`

`;



export default function Header(): JSX.Element{

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()
    const isLogged = useSelector((state:any) => state.login.isLogged)
    const dispatch = useDispatch();

    function logout(){
        localStorage.removeItem("authToken");
        localStorage.removeItem("userType");
        dispatch(logoutAction())
        router.push("/")
    }

    function gotoPersonalArea(){
        if(localStorage.getItem("userType") === "TEACHER"){
            router.push("/teacher_area");
            setMobileMenuOpen(false);
        }else if(localStorage.getItem("userType") === "STUDENT"){
            router.push("/student_area");
            setMobileMenuOpen(false);
        }
    }

    useEffect(()=>{
        if(localStorage.getItem("userType") !== null){
            dispatch(loginAction(localStorage.getItem("userType")))
        }
    },[])

    const navigation = [
        { name: 'Home', href: '#', click: ()=>{router.push("/")} },
        { name: 'Product', href: '#' },
        { name: 'Features', href: '#' },
        { name: 'Marketplace', href: '#' },
        { name: 'Company', href: '#' },
      ]

    return (
        <StyledHeader>
        <header className="absolute inset-x-0 top-0 z-50">
        <div><h1 onClick={()=>{router.push("/")}}>Supporto Studenti</h1></div>
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              {/* <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              /> */}
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
          
          {/* <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900" onClick={item.click}>
                {item.name}
              </a>
            ))}
          </div> */}
          
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          { !isLogged && 
            (<>
          <a href="#" className="mr-4 text-sm font-semibold leading-6 text-gray-900 login-register" onClick={()=>{router.push("/register");}}>
              Registrati <span aria-hidden="true" ></span>
            </a>
                    
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900" onClick={()=>{router.push("/login");}}>
              Log in <span aria-hidden="true"></span>
            </a></>
            )}
            { isLogged && 
            (<>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900 login-register mr-4" onClick={gotoPersonalArea}>
              Area Personale ({localStorage.getItem("userType") === "TEACHER"?'Insegnante':'Studente'})<span aria-hidden="true" ></span>
            </a>
                    
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900" onClick={logout}>
              Logout <span aria-hidden="true"></span>
            </a></>
            )}
          </div>
     
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                {/* <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                /> */}
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
                  {/* {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))} */}
                  <a className="-mx-3 block cursor-pointer rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" onClick={()=>{router.push("/");setMobileMenuOpen(false);}}>Home</a>
                </div>
                <div className="pt-4">
                    
                  {/* <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in */}
                    { isLogged && 
            (<>
          <a href="#" onClick={gotoPersonalArea} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" >
              Area Personale <span aria-hidden="true" ></span>
            </a>
                    
            <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" onClick={logout}>
              Logout <span aria-hidden="true"></span>
            </a></>
            )}
            { !isLogged && 
            (<>
          <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" onClick={()=>{router.push("/register");}}>
              Registrati <span aria-hidden="true" ></span>
            </a>
                    
            <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" onClick={()=>{router.push("/login");}}>
              Log in <span aria-hidden="true"></span>
            </a></>
            )}
                  {/* </a> */}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
      <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80f0ff] to-[#fcf689] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </StyledHeader>

    )
    
}