# Razorpay Lib (Angular)

Lightweight Angular helper library for Razorpay Checkout:
- Create an order via your backend
- Open Razorpay Checkout UI
- Verify payment via your backend

## Install

If you publish to npm:
- `npm i @adityakhandelwal021/razorpay-lib`

Or, to try directly from GitHub:
- `npm i github:Adityakhandelwal021/razorpay-lib`

## Backend endpoints expected

This library calls your backend (you host these endpoints):
- `POST /api/payments/create-order` → returns `RazorpayOrder`
- `POST /api/payments/verify` → returns `PaymentResult`

It also sends an `Idempotency-Key` header using your `orderId`.

## Usage

1) Configure once (e.g. `AppComponent` / `AppConfig` / a payment module init):

```ts
import { RazorpayService } from '@adityakhandelwal021/razorpay-lib';

constructor(private razorpay: RazorpayService) {
  this.razorpay.configure({
    apiUrl: 'https://your-api.example.com',
    companyName: 'Your Company',
    companyLogo: 'https://your-cdn.example.com/logo.png',
    themeColor: '#3B82F6'
  });
}
```

2) Initiate a payment:

```ts
import { PaymentOrderRequest } from '@adityakhandelwal021/razorpay-lib';

const req: PaymentOrderRequest = {
  orderId: crypto.randomUUID(),
  amount: 49900,
  currency: 'INR',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '9999999999',
  description: 'Pro plan'
};

this.razorpay.initiatePayment(req).subscribe({
  next: (result) => console.log('Payment result', result),
  error: (err) => console.error('Payment failed/cancelled', err)
});
```

## Build (library)

- `npm install`
- `npm run build`

Output: `dist/`
