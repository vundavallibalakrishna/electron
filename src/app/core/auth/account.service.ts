import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AccountService {

    private userIdentity: Account | null = null;
    private authenticationState = new ReplaySubject<Account | null>(1);
    private accountCache$?: Observable<Account | null>;

    constructor(private http: HttpClient) { }

    get(): Observable<HttpResponse<Account>> {
        return this.http.get<Account>('api/account', { observe: 'response' });
    }

    authenticate(identity: Account | null): void {
        this.userIdentity = identity;
        this.authenticationState.next(this.userIdentity);
    }

    identity(force?: boolean): Observable<Account | null> {
        if (!this.accountCache$ || force || !this.isAuthenticated()) {
            this.accountCache$ = this.fetch().pipe(
                catchError(() => {
                    return of(null);
                }),
                tap((account: Account | null) => {
                    this.authenticate(account);
                }),
                shareReplay()
            );
        }
        return this.accountCache$;
    }

    isAuthenticated(): boolean {
        return this.userIdentity !== null;
    }

    getAuthenticationState(): Observable<Account | null> {
        return this.authenticationState.asObservable();
    }

    private fetch(): Observable<Account> {
        return this.http.get<Account>('api/account');
    }

}
