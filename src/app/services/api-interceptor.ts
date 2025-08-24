import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    headers: req.headers
      .set('Content-Type', 'application/json')
      .set('x-api-key', 'reqres-free-v1')
  });
  return next(authReq).pipe(
       catchError((error) => {
         if (error.status === 401) {
           console.error('Unauthorized request - redirecting to login');
         }
         return throwError(() => new Error(`Request failed: ${error.message}`));
       })
     );
};
