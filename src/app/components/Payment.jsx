"use client";
import CheckoutForm from "../components/CheckoutForm";
import { useDispatch, useSelector } from "react-redux";
import { addClientSecret } from "../redux/actions";
import styled from "styled-components";
import React, { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const StyledPayment = styled.div`
  margin-top: 12em;
  width: 25em;
  margin-left: auto;
  margin-right: auto;
`;

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function App() {
  const [clientSecret, setClientSecret] = React.useState("");
  const priceFromRedux = useSelector((state) => state.payment.price);
  const dispatch = useDispatch();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/create-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ amount: priceFromRedux, currency: "EUR" }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        dispatch(addClientSecret(data.clientSecret));
        console.log("clientSecret: " + data.clientSecret);
      });
  }, []);

  const options = {
    clientSecret: clientSecret,
    paymentMethodCreation: "manual",
  };

  return (
    <StyledPayment>
      <div className="App">
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        )}
      </div>
    </StyledPayment>
  );
}
