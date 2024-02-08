"use client"

import Link from "next/link";
import styled from "styled-components";


const StyledHeader = styled.div`
    background-color: black;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    h1{
        font-size: 40px!important;
        text-align: center;
        padding: 1em auto;
        color: green;
        &:hover{
            cursor: pointer;
            color:white;
        }
    }
    .login-register{
        position: absolute;
        top:0.5em;
        right: 0.5em;
        color: green;
        span{
            margin-right: 0.5em;
            &:hover{
                color:white;
                cursor: pointer;
            }
        }
    }
`;

export default function Header(): JSX.Element{
    return (
    <StyledHeader>
    <h1>Supporto Studenti</h1>
    <div className="login-register"><Link href="/register"><span>register</span></Link><Link href="/login"><span>login</span></Link></div>
    </StyledHeader>)
    
}