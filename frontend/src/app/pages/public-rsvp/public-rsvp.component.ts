import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { RsvpService } from '../../services/rsvp.service';

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-public-rsvp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './public-rsvp.component.html'
})
export class PublicRsvpComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly rsvpService = inject(RsvpService);
  private countdownTimer?: number;
  private galleryTimer?: number;

  @ViewChild('backgroundMusic') backgroundMusic?: ElementRef<HTMLAudioElement>;

  readonly environment = environment;
  readonly loading = signal(false);
  readonly success = signal(false);
  readonly error = signal('');
  readonly showIntro = signal(true);
  readonly currentSlide = signal(0);
  readonly musicEnabled = signal(false);
  readonly countdown = signal<CountdownParts>(this.calculateCountdown());

  readonly galleryImages = Array.from({ length: 14 }, (_, index) => `assets/images/gallery/photo-${index + 1}.jpeg`);
  readonly activeGalleryImage = computed(() => this.galleryImages[this.currentSlide()]);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    attendance: ['yes', Validators.required],
    companionsCount: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    companions: this.fb.array([]),
    busOption: ['no_bus', Validators.required],
    allergies: [''],
    foodPreference: ['none', Validators.required],
    mustPlaySong: ['']
  });

  ngOnInit(): void {
    window.setTimeout(() => this.showIntro.set(false), 2300);
    this.countdownTimer = window.setInterval(() => this.countdown.set(this.calculateCountdown()), 1000);
    this.galleryTimer = window.setInterval(() => this.nextSlide(), 4500);
  }

  ngOnDestroy(): void {
    if (this.countdownTimer) window.clearInterval(this.countdownTimer);
    if (this.galleryTimer) window.clearInterval(this.galleryTimer);
  }

  get companions(): FormArray {
    return this.form.controls.companions;
  }

  updateCompanions(): void {
    const count = Number(this.form.controls.companionsCount.value || 0);
    while (this.companions.length < count) {
      this.companions.push(this.fb.nonNullable.group({ fullName: ['', Validators.required] }));
    }
    while (this.companions.length > count) {
      this.companions.removeAt(this.companions.length - 1);
    }
  }

  nextSlide(): void {
    this.currentSlide.set((this.currentSlide() + 1) % this.galleryImages.length);
  }

  previousSlide(): void {
    this.currentSlide.set((this.currentSlide() - 1 + this.galleryImages.length) % this.galleryImages.length);
  }

  selectSlide(index: number): void {
    this.currentSlide.set(index);
  }

  toggleMusic(): void {
    const audio = this.backgroundMusic?.nativeElement;
    if (!audio) return;

    if (audio.paused) {
      audio.volume = 0.28;
      audio.play().then(() => this.musicEnabled.set(true)).catch(() => this.error.set('Pulsa de nuevo para activar la música.'));
    } else {
      audio.pause();
      this.musicEnabled.set(false);
    }
  }

  submit(): void {
    this.error.set('');
    this.success.set(false);
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.error.set('Revisa los campos obligatorios antes de enviar.');
      return;
    }

    this.loading.set(true);
    this.rsvpService.create(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.success.set(true);
        this.form.reset({
          fullName: '',
          attendance: 'yes',
          companionsCount: 0,
          busOption: 'no_bus',
          allergies: '',
          foodPreference: 'none',
          mustPlaySong: ''
        });
        this.companions.clear();
      },
      error: () => this.error.set('No se pudo enviar la respuesta. Inténtalo de nuevo.'),
      complete: () => this.loading.set(false)
    });
  }

  private calculateCountdown(): CountdownParts {
    const diff = Math.max(new Date(environment.weddingDate).getTime() - Date.now(), 0);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  }
}
