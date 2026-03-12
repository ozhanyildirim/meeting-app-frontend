import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MeetingService } from '../../../core/services/meeting.service';
import { DocumentResponse } from '../../../core/models/meeting.model';

@Component({
    selector: 'app-meeting-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './meeting-form.component.html',
    styleUrl: './meeting-form.component.scss'
})
export class MeetingFormComponent implements OnInit {
    form = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        description: [''],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    });

    isEdit = false;
    meetingId: number | null = null;
    loading = false;
    loadingData = false;
    error = '';
    selectedFile: File | null = null;
    existingDocument: DocumentResponse | null = null;
    removeDocument = false;

    constructor(
        private fb: FormBuilder,
        private meetingService: MeetingService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit = true;
            this.meetingId = +id;
            this.loadMeeting(+id);
        }
    }

    loadMeeting(id: number) {
        this.loadingData = true;
        this.meetingService.getById(id).subscribe({
            next: m => {
                this.form.patchValue({
                    title: m.title,
                    description: m.description,
                    startDate: this.toInputDateTime(m.startDate),
                    endDate: this.toInputDateTime(m.endDate),
                });
                if (m.document) this.existingDocument = m.document;
                this.loadingData = false;
            },
            error: () => { this.error = 'Toplantı yüklenemedi.'; this.loadingData = false; }
        });
    }

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this.selectedFile = input.files[0];
            this.removeDocument = false;
        }
    }

    onRemoveDocument() {
        this.existingDocument = null;
        this.selectedFile = null;
        this.removeDocument = true;
    }

    async onSubmit() {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }
        this.loading = true;
        this.error = '';

        try {
            const document = this.selectedFile
                ? await this.meetingService.fileToBase64(this.selectedFile)
                : undefined;

            if (this.isEdit) {
                const payload = {
                    ...this.form.value,
                    document,
                    removeDocument: this.removeDocument
                };
                this.meetingService.update(this.meetingId!, payload as any).subscribe({
                    next: () => { this.loading = false; this.router.navigate(['/meetings']); },
                    error: err => { this.error = err.error?.message || 'Güncelleme başarısız.'; this.loading = false; }
                });
            } else {
                const payload = { ...this.form.value, document };
                this.meetingService.create(payload as any).subscribe({
                    next: () => { this.loading = false; this.router.navigate(['/meetings']); },
                    error: err => { this.error = err.error?.message || 'Oluşturma başarısız.'; this.loading = false; }
                });
            }
        } catch {
            this.error = 'Dosya okunamadı.';
            this.loading = false;
        }
    }

    formatFileSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    private toInputDateTime(date: string): string {
        if (!date) return '';
        const [d, t] = date.split('T');
        const [year, month, day] = d.split('-');
        const [hour, minute] = t.split(':');
        return `${year}-${month}-${day}T${hour}:${minute}`;
    }

    get title() { return this.form.get('title')!; }
    get startDate() { return this.form.get('startDate')!; }
    get endDate() { return this.form.get('endDate')!; }
}