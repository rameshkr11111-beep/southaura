interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: FormDataEntryValue | null; email?: FormDataEntryValue | null; contact?: FormDataEntryValue | null };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
  on(event: "payment.failed", handler: (response: RazorpayFailureResponse) => void): void;
}

interface Window {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}
