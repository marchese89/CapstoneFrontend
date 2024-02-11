"use client";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import React from "react";
// import stripePromise from '../utils/stripe';
import { FormEvent } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

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
      .then((res) => res.json())
      .then((data) => {
        router.push("/");
        console.log(data.message);
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

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <div className="flex justify-center">
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : ""}Paga
            Adesso
          </span>
        </button>
      </div>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
