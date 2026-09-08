import { env } from "../config/env";

const FLW_BASE_URL = "https://api.flutterwave.com/v3";

interface InitiatePaymentParams {
  amount: number;
  currency: string;
  email: string;
  txRef: string;
  redirectUrl: string;
  title: string;
}

// Starts a Flutterwave "Standard" checkout — returns a hosted payment
// page URL to redirect the student to. Uses a placeholder test key
// (FLW_SECRET_KEY in .env) until a real one replaces it; until then this
// will fail with Flutterwave's own "invalid key" error, which is
// expected and surfaces to the student as "Could not start payment".
export async function initiateFlutterwavePayment(params: InitiatePaymentParams): Promise<string> {
  const response = await fetch(`${FLW_BASE_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.flutterwave.secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: params.txRef,
      amount: params.amount,
      currency: params.currency,
      redirect_url: params.redirectUrl,
      customer: { email: params.email },
      customizations: { title: params.title },
    }),
  });

  const data = await response.json();
  if (!response.ok || data.status !== "success") {
    throw new Error(data.message ?? "Flutterwave payment initiation failed");
  }

  return data.data.link as string;
}

export interface FlutterwaveTransaction {
  status: string;
  amount: number;
  currency: string;
  tx_ref: string;
  id: number;
}

// Always call this server-side to confirm a payment before crediting
// anything — Flutterwave's redirect back to the app includes a status in
// the URL, but that's client-controlled and can be forged. This hits
// Flutterwave's own API with the secret key to get the real, trusted
// status of the transaction.
export async function verifyFlutterwaveTransaction(transactionId: string): Promise<FlutterwaveTransaction> {
  const response = await fetch(`${FLW_BASE_URL}/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${env.flutterwave.secretKey}` },
  });

  const data = await response.json();
  if (!response.ok || data.status !== "success") {
    throw new Error(data.message ?? "Could not verify transaction with Flutterwave");
  }

  return data.data as FlutterwaveTransaction;
}
