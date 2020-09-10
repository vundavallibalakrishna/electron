import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IWorkspace } from 'app/shared/models/workspace.model';

@Injectable({ providedIn: 'root' })
export class WorkpaceService {

    public resourceUrl = 'api/workspace';

    constructor(private http: HttpClient) { }

    loadUserWorkspaces(): Observable<any> {
        return this.http
            .get<IWorkspace[]>(`${this.resourceUrl}/current_user`, { observe: 'response' });
    }

    authenticateCurrentWorkspace(): Observable<any> {
        return this.http
            .post(`api/authenticate/workspace`, { observe: 'response' });
    }

}