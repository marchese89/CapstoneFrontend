"use client";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
// import stripePromise from '../utils/stripe';
import { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { removePaymentData } from "../redux/actions";

const StyledPaymentForm = styled.div`
  .card-element {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

export default function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const priceFromRedux = useSelector((state) => state.payment.price);
  const solutionIdFromRedux = useSelector((state) => state.payment.solutionId);
  const requestIdFromRedux = useSelector((state) => state.payment.requestId);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const clientSecretFromRedux = useSelector(
    (state) => state.payment.clientSecret
  );

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    // const clientSecret = new URLSearchParams(window.location.search).get(
    //   "payment_intent_client_secret"
    // );
    // console.log("client secret da checkout form: " + clientSecret);

    if (!clientSecretFromRedux) {
      return;
    } else {
      console.log("client secret: " + clientSecretFromRedux);
    }

    // stripe
    //   .retrievePaymentIntent(clientSecretFromRedux)
    //   .then(({ paymentIntent }) => {
    //     switch (paymentIntent.status) {
    //       case "succeeded":
    //         setMessage("Payment succeeded!");
    //         break;
    //       case "processing":
    //         setMessage("Your payment is processing.");
    //         break;
    //       case "requires_payment_method":
    //         setMessage("Your payment was not successful, please try again.");
    //         break;
    //       default:
    //         setMessage("Something went wrong.");
    //         break;
    //     }
    //   });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    // const { error } = await stripe.confirmPayment({
    //   elements,
    //   confirmParams: {
    //     // Make sure to change this to your payment completion page
    //     return_url: "http://localhost:3000",
    //   },
    // });

    // const cardElement = elements.getElement(PaymentElement);

    elements.submit();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      // type: "card",
      // card: cardElement,
      elements,
      // params: {
      //   billing_details: {
      //     name: "Jenny Rosen",
      //   },
      // },
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

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
        if (res.status === 401) {
          throw new Error("Problems with payment");
        }
        res.json();
      })
      .then((data) => {
        router.push(`/student_area/requests/${requestIdFromRedux}`);
        // console.log(data.message);
      })
      .catch((error) => {
        dispatch(removePaymentData());
        setIsOpen(true);
        // console.log(error);
      });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.

    // if (error.type === "card_error" || error.type === "validation_error") {
    //   setMessage(error.message);
    // } else {
    //   setMessage("An unexpected error occurred.");
    // }

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
              <h2 className="text-lg font-semibold">
                Problemi con il pagamento
              </h2>
            </div>
            <div>
              Ci sono stati problemi durante il pagamento, si prega di riprovare
            </div>
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
    </>
  );
}
