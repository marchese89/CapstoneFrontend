"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components"
import { Invoice } from "../types";
import { format } from "date-fns/format";

const StyledInvoices = styled.div`
        text-align: center;
    margin-top: 1em;
    .plus{
      &:hover{
        cursor: pointer;
      }
    }
    .subjects{
      display: flex;
      justify-content: center;
      height: 330px;
      
    }
    .icon{
            &:hover{
              cursor: pointer;
            }
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
  .requests-table{
    width: 60%;
    
  }
  @media screen and (max-width: 640px) {
      .requests-table{
        display: none;
    
      }
      .subjects{
        height: 0px;
      }
      
      .subjects-mobile{
        display: block;
        width: 90%;
        margin-left: auto;
        margin-right: auto;
      }
  }
  @media screen and (min-width: 640px) and (max-width: 768px) {
      .requests-table{
        margin-left: 3em;
        margin-right: 3em;
      }
  }
  /* and (max-width: 768px) */

  @media screen and(min-width: 768px) {
    .subjects-mobile{
        display: none;
      }
  }
  .request{
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
`;

export default function Invoices():JSX.Element{

    const [invoicesList,setInvoicestList] = useState<Invoice[]>([]);
    const [maxPage, setMaxPage] = useState(1);
    const [pages, setPages] = useState<number[]>();
    const [selectedPage, setSelectedPage] = useState<string|number>(0);
    const [sortDirection,setSortDirection] = useState<string>('desc');
    const [yearsList,setYearsList] = useState<number[]>();
    const [yearSelected,setYearSelected] = useState<number>();
    const [monthSelected,setMonthSelected] = useState<number>(1);
    const [totaPerMonth,setTotaPerMonth] = useState<number>();
    const router = useRouter();

    function getYears(){
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/invoices/yearsByTeacher`, {
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
          .then((years)=>{
            setYearsList(years);
            setYearSelected(years[0]);
            console.log("years: ")
            console.log(years);
          }) 
          .catch((error:Error)=>{
            console.log(error);
          })
    }


    function getInvoices(page:number){
        if(!yearSelected){
          return;
        }
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/invoices/byTeacher?page=${page}&size=5&direction=${sortDirection}&orderBy=issuingDate&year=${yearSelected}&month=${monthSelected}`, {
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
        .then((invoicesPage)=>{
          const totPages = invoicesPage.totalPages;
            setMaxPage(invoicesPage.totalPages - 1);
            const array = [];
            for (let i = 0; i < totPages && i <= 4; i++) {
              array.push(i);
            }
            setPages(array);
            setInvoicestList(invoicesPage.content);
            
            console.log(invoicesPage.content);
        })
        .catch((error:Error)=>{
          console.log(error);
        })
      }

      useEffect(()=>{
        if(!invoicesList){
          return;
        }
        setTotaPerMonth(invoicesList.reduce((acc:number,invoice:Invoice) => acc + invoice.total,0)/100);
      },[invoicesList])

      useEffect(()=>{
        getYears();
      },[sortDirection])

      useEffect(()=>{
        const sp = Number(selectedPage);
          if(!isNaN(sp)){
            getInvoices(sp);
          }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[yearSelected,monthSelected,sortDirection])


    return <StyledInvoices>
            <div className="flex items-center mb-4 justify-center">
    Ordina per data 
    {sortDirection === 'desc' && (
      <svg onClick={()=>setSortDirection('asc')}  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
    </svg>
    )}
    {sortDirection === 'asc' && (
      <svg onClick={()=>setSortDirection('desc')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
    </svg>
    )}
    <div className="flex items-center">Anno&nbsp;
  <select value={yearSelected} onChange={(e)=>{setYearSelected(parseInt(e.target.value))}} className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500">
    {yearsList && yearsList.map((year:number,i:number)=>(
        <option value={year} key={i}>{year}</option>
))}
    
    
  </select>
</div>
<div className="flex items-center">&nbsp;Mese&nbsp;
  <select value={monthSelected} onChange={(e)=>{setMonthSelected(parseInt(e.target.value))}} className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500">
    
        <option value={1}>Gennaio</option>
        <option value={2}>Febbraio</option>
        <option value={3}>Marzo</option>
        <option value={4}>Aprile</option>
        <option value={5}>Maggio</option>
        <option value={6}>Giugno</option>
        <option value={7}>Luglio</option>
        <option value={8}>Agosto</option>
        <option value={9}>Settembre</option>
        <option value={10}>Ottobre</option>
        <option value={11}>Novembre</option>
        <option value={12}>Dicembre</option>

  </select>
</div>
&nbsp;
Totale Mensile: {totaPerMonth}&nbsp;&euro;
</div>
<div className="subjects flex flex-column">

  <table className="rounded overflow-hidden requests-table h-1">
    <thead>
      <tr>
        <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Nmero Fattura</th>
        <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Data</th>
        <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Totale</th>
        <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Dettagli</th>
      </tr>
    </thead>
    <tbody className="bg-white">
    {invoicesList.map((invoice:Invoice,i:number) =>(
      
      
        <tr key={i}>
        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center whitespace-nowrap">{invoice.number}</td>
        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center whitespace-nowrap">{` ${format(invoice.issuingDate,'dd/MM/yyyy')}`}</td>
        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center whitespace-nowrap">{invoice.total/100}&nbsp;&euro;</td>
        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center whitespace-nowrap">
        <div className="flex justify-center">
        <svg 
          onClick={()=>{router.push(`/teacher_area/invoices/${invoice.id}`)}} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-6 h-6 icon">
          <path strokeLinecap="round" 
          strokeLinejoin="round" 
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        </div>
        </td>
        </tr>
      
    ))
    }
    
</tbody>
</table>
</div> 

<div className="subjects-mobile hidden">
  <div className="list-disc">
    {invoicesList.map((invoice:Invoice,i:number) =>
      
      (<div key={i} className="flex justify-between flex-col request">
        <div className="flex flex-col">
        <strong>Numero Fattura</strong>
        {invoice.number}
        </div>
        <div className="flex flex-col">
        <strong>Data Fattura</strong>
        {format(invoice.issuingDate,'dd/MM/yyyy')}
        </div>
        <div className="flex flex-col">
        <strong>Totale Fattura</strong>
        <div className="flex justify-center">{invoice.total/100}&nbsp;<strong>&euro;</strong></div>
        </div>
          <div className="flex justify-center">
        <svg onClick={()=>{router.push(`/teacher_area/invoices/${invoice.id}`)}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 icon">
  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
</svg>

  </div>
      </div>
    ))
    }
</div>
</div>
<div className="flex justify-center mt-4">
        {pages && pages.map((page, i) => (
          <span
            key={i}
            className={`link ${selectedPage == page ? "selected" : ""} mx-1 mr-4 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            onClick={() => {
              setSelectedPage(page);
              getInvoices(page);
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
              if(!isNaN(sp)){
                getInvoices(sp);
              }
              
            }}
          >
            Vai
          </button>
          <span className="mx-2">{`max ${maxPage}`}</span>
        </span>
      </div> 
    </StyledInvoices>
}