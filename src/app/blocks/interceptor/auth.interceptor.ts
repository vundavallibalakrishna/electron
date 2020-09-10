import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaderResponse, HttpResponse } from '@angular/common/http';
import { SERVER_API_URL } from 'app/app.constants'
import { tap } from 'rxjs/operators';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const position = request.url.indexOf('s3.amazonaws.com');
        const token = window.localStorage.getItem("token");
        const url = (window.localStorage.getItem("workspaceURL") ?? SERVER_API_URL) + request.url;
        const workspaceToken = localStorage.getItem("workspaceToken");
        if (position < 0) {
            if (!!token) {
                request = request.clone({
                    url: url,
                    setHeaders: {
                        Authorization: 'Bearer ' + token,
                        'X-Workspace-Token': workspaceToken ?? ""
                    }
                });
            }
        }
        return next.handle(request).pipe(
            tap(
                (event: HttpResponse<any>) => {
                    const token = event?.headers?.get("X-Workspace-Token");
                    if (token?.length > 0)
                        localStorage.setItem("workspaceToken", token);
                }
            )
        );
    }
}