import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const razorpayInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  if (req.url.includes('/api/payments')) {
    const token = localStorage.getItem('auth_token');
    const appId = localStorage.getItem('app_id') || 'benepik-app';

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'X-App-Id': appId
        }
      });
      return next(cloned);
    }
  }
  return next(req);
};
