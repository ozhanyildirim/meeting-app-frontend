import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meeting, CreateMeetingRequest, UpdateMeetingRequest, DocumentUpload } from '../models/meeting.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MeetingService {
    private baseUrl = `${environment.apiUrl}/meetings`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Meeting[]> {
        return this.http.get<Meeting[]>(this.baseUrl);
    }

    getById(id: number): Observable<Meeting> {
        return this.http.get<Meeting>(`${this.baseUrl}/${id}`);
    }

    create(payload: CreateMeetingRequest): Observable<Meeting> {
        return this.http.post<Meeting>(this.baseUrl, payload);
    }

    update(id: number, payload: UpdateMeetingRequest): Observable<Meeting> {
        return this.http.put<Meeting>(`${this.baseUrl}/${id}`, payload);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    cancel(id: number): Observable<void> {
        return this.http.patch<void>(`${this.baseUrl}/${id}/cancel`, {});
    }

    async fileToBase64(file: File): Promise<DocumentUpload> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve({ fileName: file.name, base64Content: base64 });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}