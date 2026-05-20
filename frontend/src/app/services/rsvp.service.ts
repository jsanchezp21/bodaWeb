import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { RsvpResponse } from '../models/rsvp.model';

@Injectable({ providedIn: 'root' })
export class RsvpService {
  private readonly http = inject(HttpClient);

  create(payload: RsvpResponse) {
    return this.http.post<RsvpResponse>(`${environment.apiUrl}/rsvp`, payload);
  }

  list() {
    return this.http.get<RsvpResponse[]>(`${environment.apiUrl}/rsvp`);
  }

  exportUrl(): string {
    return `${environment.apiUrl}/rsvp/export`;
  }
  
  deleteRsvp(id: string) {
  return this.http.delete(`${this.apiUrl}/rsvp/${id}`);
  }
}
