"use client";

import { useEffect, useState } from "react";
import { Invoice } from "../types";
import styled from "styled-components";

type InvoiceParam = {
  invoiceId: number;
};

const StyledInvoice = styled.div`
  margin-top: 1em;
  margin-left: auto;
  margin-right: auto;
  background-color: aliceblue;
  padding-bottom: 2em;
`;

const Invoice: React.FC<InvoiceParam> = ({ invoiceId }) => {
  const [fileInvoice, setFileInvoice] = useState<string>();
  const [typeInvoice, setTypeInvoice] = useState<string>();
  const [invoice, setInvoice] = useState<Invoice>();

  function getInvoice(invoiceId: number) {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/invoices/${invoiceId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("Errore nella richiesta: " + response.statusText);
        }
        return response.json();
      })
      .then((invoice: Invoice) => {
        setInvoice(invoice);
      })
      .catch((error) => {
        console.error(error);
      });
  }

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

  useEffect(() => {
    getInvoice(invoiceId);
  }, []);

  useEffect(() => {
    if (!invoice) {
      return;
    }
    getFile(invoice.invoiceFileUrl, setFileInvoice, setTypeInvoice);
  }, [invoice]);

  return (
    <StyledInvoice>
      {fileInvoice && typeInvoice && (
        <div className="text-center flex flex-col items-center mb-4">
          <h2 className="text-center">
            <strong>Fattura</strong>
          </h2>
          <embed
            className="mt-4"
            src={
              fileInvoice +
              `${typeInvoice === "application/pdf" ? "#view=FitH" : ""}`
            }
            type={typeInvoice}
          />
        </div>
      )}
    </StyledInvoice>
  );
};

export default Invoice;
