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

  readonly totalYes = computed(() =>
    this.responses().filter((item) => item.attendance === 'yes').length
  );

  readonly totalNo = computed(() =>
    this.responses().filter((item) => item.attendance === 'no').length
  );

  readonly totalPeopleAttending = computed(() =>
    this.responses()
      .filter((item) => item.attendance === 'yes')
      .reduce((total, item) => total + 1 + Number(item.companionsCount || 0), 0)
  );

  readonly busRoundTrip = computed(() =>
    this.responses().filter((item) => item.busOption === 'round_trip').length
  );

  readonly busOnlyGo = computed(() =>
    this.responses().filter((item) => item.busOption === 'only_go').length
  );

  readonly busOnlyReturn = computed(() =>
    this.responses().filter((item) => item.busOption === 'only_return').length
  );

  readonly busNo = computed(() =>
    this.responses().filter((item) => item.busOption === 'no_bus').length
  );

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

  labelBusOption(value: string): string {
    const labels: Record<string, string> = {
      round_trip: 'Ida y vuelta',
      only_go: 'Solo ida',
      only_return: 'Solo vuelta',
      no_bus: 'No necesito autobús'
    };

    return labels[value] || value;
  }

  companionsLabel(item: RsvpResponse): string {
    return item.companions?.map((companion) => companion.fullName).join(', ') || '';
  }
}

