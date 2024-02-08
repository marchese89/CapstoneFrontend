"use client"

import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from "react";
import styled from "styled-components";


const StyledRegister = styled.div`
    text-align: center;
    h2{
        font-size: 26px;
        color: green;
    }
    form{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        button{
            color: green;
            border: green;
            background-color: beige;
            padding: 0.4em;
            border-radius: 7px;
            border: 1px solid green;
            margin-top: 1.5em;
            &:hover{
                cursor: pointer;
                color: black;
                background-color: aliceblue;
            }
        }
        input{
            border: 1px solid green;
            border-radius: 7px;
            &:focus{
                outline: none;
            }
        }
        div{
            margin: 0.5em;
            display: flex;
            align-items: flex-start;
            min-width: 600px;
            justify-content: space-between;
        }
        label{
            margin-right: 0.3em;
            color: green;
        }
        input{
            margin-right: 0.3em;
        }
    }
    .outer{
        display: flex;
        flex-direction: column;
    }
`;

type UserRegisterDTO = {
    name:string;
    surname:string;
    email:string;
    password:string;
    cf:string;
    role:string;
    street:string;
    houseNumber:string;
    city:string;
    province:string;
    postalCode:string;
    piva:string;
}

export default function Register(): JSX.Element{
    
    const [user,setUser] = useState<UserRegisterDTO>(
        {
            name:'',
            surname:'',
            email:'',
            password:'',
            cf:'',
            role:'',
            street:'',
            houseNumber:'',
            city:'',
            province:'',
            postalCode:'',
            piva:''
        }
    );
    
    function handleInputChangeUser(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>){
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        }
        )
    }


    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
        console.log(user);
        setUser({
            name:'',
            surname:'',
            email:'',
            password:'',
            cf:'',
            role:'',
            street:'',
            houseNumber:'',
            city:'',
            province:'',
            postalCode:'',
            piva:''
        })
    }


    return(
        <StyledRegister>
            <div className="outer">
            <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                    <label htmlFor="name">Nome</label>
                    <input type="text" name="name" value={user.name} onChange={handleInputChangeUser}></input>
                    <label htmlFor="name">Cognome</label>
                    <input type="text" name="surname" value={user.surname} onChange={handleInputChangeUser}></input>
                    </div>
                    <div>
                    <label htmlFor="name">Email</label>
                    <input type="text" name="email" value={user.email} onChange={handleInputChangeUser}></input>
                    <label htmlFor="name">Password</label>
                    <input type="text" name="password" value={user.password} onChange={handleInputChangeUser}></input>
                    </div>
                    <div>
                    <label htmlFor="name">CF</label>
                    <input type="text" name="cf" value={user.cf} onChange={handleInputChangeUser}></input>
                    <label htmlFor="name">RUOLO</label>
                    <select name="role" value={user.role} onChange={handleInputChangeUser}>
                        <option></option>
                        <option value={"STUDENT"}>Studente</option>
                        <option value={"TEACHER"}>Insegnante</option>
                    </select>
                    {/* <input type="text" name="role" value={}></input> */}
                    </div>
                    <div>
                    <label htmlFor="name">Via</label>
                    <input type="text" name="street" value={user.street} onChange={handleInputChangeUser}></input>
                    <label htmlFor="name">Numero Civico</label>
                    <input type="text" name="houseNumber" value={user.houseNumber} onChange={handleInputChangeUser}></input>
                    </div>
                    <div>
                    <label htmlFor="name">Città</label>
                    <input type="text" name="city" value={user.city} onChange={handleInputChangeUser}></input>
                    <label htmlFor="name">Provincia</label>
                    <input type="text" name="province" value={user.province} onChange={handleInputChangeUser}></input>
                    </div>
                    <div>
                    <label htmlFor="name">CAP</label>
                    <input type="text" name="postalCode" value={user.postalCode} onChange={handleInputChangeUser}></input>
                    <label htmlFor="name">PIVA</label>
                    <input type="text" name="piva" value={user.piva} onChange={handleInputChangeUser}></input>
                    </div>
                    <button>Registrati</button>
                </form>
            </div>
        </StyledRegister>
    )
}