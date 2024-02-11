"use client";
import styled from "styled-components";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const StyledPayment = styled.div`
  margin-top: 12em;
  width: 25em;
  margin-left: auto;
  margin-right: auto;
`;

// export default function Payment():JSX.Element{
//     const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY !== undefined? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:'');

//     return <StyledPayment className="text-center">
//         <h2>Pagamento</h2>
//     </StyledPayment>;
// }

import CheckoutForm from "../components/CheckoutForm";
import { useDispatch, useSelector } from "react-redux";
import { addClientSecret } from "../redux/actions";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function App() {
  const [clientSecret, setClientSecret] = React.useState("");
  // const [paymentId, setPaymentId] = useState("");
  const priceFromRedux = useSelector((state) => state.payment.price);
  const dispatch = useDispatch();

  React.useEffect(() => {
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

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret: clientSecret,
    // appearance: "dark",
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
