export interface PaymentOrderRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description?: string;
}

export interface RazorpayOrder {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId?: string;
}

export interface PaymentVerifyRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  internalOrderId: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  message: string;
}

export interface RazorpayConfig {
  apiUrl: string;
  companyName: string;
  keyId?: string;
  companyLogo?: string;
  themeColor?: string;
}
