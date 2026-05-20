import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { RsvpResponse } from '../../models/rsvp.model';
import { AuthService } from '../../services/auth.service';
import { RsvpService } from '../../services/rsvp.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html'
})
export class AdminPanelComponent {
  private readonly rsvpService = inject(RsvpService);
  private readonly authService = inject(AuthService);

  readonly responses = signal<RsvpResponse[]>([]);
  readonly search = signal('');
  readonly sortBy = signal<keyof RsvpResponse>('createdAt');
  readonly exportUrl = this.rsvpService.exportUrl();

  readonly filteredResponses = computed(() => {
    const text = this.search().toLowerCase().trim();
    const list = [...this.responses()];

    return list
      .filter((item) => JSON.stringify(item).toLowerCase().includes(text))
      .sort((a, b) => String(b[this.sortBy()] ?? '').localeCompare(String(a[this.sortBy()] ?? '')));
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.rsvpService.list().subscribe({ next: (items) => this.responses.set(items) });
  }
  
  deleteRsvp(id: string): void {
  const confirmed = confirm('¿Seguro que quieres eliminar esta respuesta?');

  if (!confirmed) {
    return;
  }

  this.rsvpService.deleteRsvp(id).subscribe({
    next: () => {
      this.responses.update((items) => items.filter((item) => item._id !== id));
    },
    error: (error) => {
      console.error(error);
      alert('No se ha podido eliminar la respuesta.');
    }
  });
}

  logout(): void {
    this.authService.logout();
    location.href = '/admin';
  }

  exportExcel(): void {
    const token = this.authService.getToken();
    fetch(this.exportUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'respuestas-boda.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      });
  }
  
  

  labelAttendance(value: string): string {
    return value === 'yes' ? 'Sí' : 'No';
  }

  companionsLabel(item: RsvpResponse): string {
    return item.companions?.map((companion) => companion.fullName).join(', ') || '';
  }
}

