import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BulkUploadService {

    public resourceUrl = 'api/workspace';

    constructor(private http: HttpClient) { }

    loadUserWorkspaces(): Observable<any> {
        return this.http
            .get<any[]>(`${this.resourceUrl}/current_user`, { observe: 'response' });
    }

}