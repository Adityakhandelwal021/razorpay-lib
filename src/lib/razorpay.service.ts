/// <reference path="./razorpay.d.ts" />
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import {
  PaymentOrderRequest,
  RazorpayOrder,
  PaymentVerifyRequest,
  PaymentResult,
  RazorpayConfig
} from './razorpay.model';



@Injectable({ providedIn: 'root' })
export class RazorpayService {
  private http = inject(HttpClient);
  private config: RazorpayConfig = { apiUrl: '', companyName: 'Benepik' };

  configure(config: RazorpayConfig): void {
    this.config = config;
    this.loadRazorpayScript();
  }

  private loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof Razorpay !== 'undefined') { resolve(); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject('Razorpay script failed to load');
      document.body.appendChild(script);
    });
  }

  createOrder(request: PaymentOrderRequest): Observable<RazorpayOrder> {
    const headers = new HttpHeaders({
      'Idempotency-Key': request.orderId
    });
    return this.http.post<RazorpayOrder>(
      `${this.config.apiUrl}/api/payments/create-order`,
      request,
      { headers }
    );
  }

  openCheckout(order: RazorpayOrder, request: PaymentOrderRequest): Observable<PaymentVerifyRequest> {
    return new Observable(observer => {
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: this.config.companyName,
        description: request.description || 'Payment',
        image: this.config.companyLogo || '',
        prefill: {
          name: request.customerName,
          email: request.customerEmail,
          contact: request.customerPhone
        },
        theme: { color: this.config.themeColor || '#3B82F6' },
        handler: (response: any) => {
          observer.next({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            internalOrderId: request.orderId
          });
          observer.complete();
        },
        modal: {
          ondismiss: () => observer.error(new Error('Payment cancelled by user'))
        }
      };

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        observer.error(new Error(resp.error.description));
      });
      rzp.open();
    });
  }

  verifyPayment(verifyRequest: PaymentVerifyRequest): Observable<PaymentResult> {
    return this.http.post<PaymentResult>(
      `${this.config.apiUrl}/api/payments/verify`,
      verifyRequest
    );
  }

  initiatePayment(request: PaymentOrderRequest): Observable<PaymentResult> {
    return this.createOrder(request).pipe(
      switchMap(order =>
        this.openCheckout(order, request).pipe(
          switchMap(verifyReq => this.verifyPayment(verifyReq))
        )
      ),
      catchError(err => throwError(() => err))
    );
  }
}
