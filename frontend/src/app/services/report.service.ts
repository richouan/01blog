import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportRequest, ReportResponse } from '../models/report.models';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:8080/api/reports';

  constructor(private http: HttpClient) {}

  // Submit a report against a student profile or post
  submitReport(request: ReportRequest): Observable<ReportResponse> {
    return this.http.post<ReportResponse>(this.apiUrl, request);
  }
}
