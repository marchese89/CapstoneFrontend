"use client";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removePaymentData } from "../redux/actions";

export default function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const priceFromRedux = useSelector((state) => state.payment.price);
  const solutionIdFromRedux = useSelector((state) => state.payment.solutionId);
  const requestIdFromRedux = useSelector((state) => state.payment.requestId);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [responseHeader, setResponseHeader] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [user, setUser] = useState();

  const clientSecretFromRedux = useSelector(
    (state) => state.payment.clientSecret
  );

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecretFromRedux) {
      return;
    } else {
      console.log("client secret: " + clientSecretFromRedux);
    }
  }, [stripe]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => {
        if (!(response.status === 200)) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    elements.submit();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      // type: "card",
      // card: cardElement,
      elements,
      params: {
        billing_details: {
          name: user.name + " " + user.surname,
          email: user.email,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }
    setPaymentInProgress(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/confirm-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({
        paymentMethodId: paymentMethod.id,
        amount: priceFromRedux,
        currency: "EUR",
        solutionId: solutionIdFromRedux,
      }),
    })
      .then((res) => {
        setPaymentInProgress(false);
        if (res.status === 401) {
          throw new Error("Problems with payment");
        }
        console.log("pagamento ok");
        dispatch(removePaymentData());
        setResponseHeader("Pagamento completato");
        setResponseMessage("Il suo pagamento è stato completato con successo");
        setIsOpen(true);
      })
      .catch((error) => {
        dispatch(removePaymentData());
        setResponseHeader("Problemi con il pagamento");
        setResponseMessage(
          "Ci sono stati problemi durante il pagamento, si prega di riprovare"
        );
        setIsOpen(true);
      });

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  function handleClose() {
    setIsOpen(false);
    router.push(`/student_area/requests/${requestIdFromRedux}`);
  }

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <div className="flex justify-center">
          <button
            disabled={isLoading || !stripe || !elements}
            id="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <span id="button-text">
              {isLoading ? <div className="spinner" id="spinner"></div> : ""}
              Paga Adesso
            </span>
          </button>
        </div>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
      {/* Modal */}
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
                onClick={handleClose}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
            {/* Titolo */}
            <div className="mb-4 text-center">
              <h2 className="text-lg font-semibold">{responseHeader}</h2>
            </div>
            <div>{responseMessage}</div>
            <div className="text-center">
              {/* Bottone di submit */}
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleClose}
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal */}
      {paymentInProgress && (
        <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute bg-white p-6 rounded-lg shadow-xl">
            <div>
              {/* Titolo */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-center">
                  Pagamento in corso
                </h2>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Il suo pagamento è in corso, non lasciare questa pagina
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
