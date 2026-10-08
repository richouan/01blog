import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportRequest, ReportResponse } from '../models/report.models';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:8080/api/reports';
  private adminUrl = 'http://localhost:8080/api/admin/reports';

  constructor(private http: HttpClient) {}

  // Submit a report against a student profile or post
  submitReport(request: ReportRequest): Observable<ReportResponse> {
    return this.http.post<ReportResponse>(this.apiUrl, request);
  }

  // Admin: Fetch all submitted moderation reports
  getAllReports(): Observable<ReportResponse[]> {
    return this.http.get<ReportResponse[]>(this.adminUrl);
  }

  // Admin: Dismiss / delete a report
  dismissReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }
}
