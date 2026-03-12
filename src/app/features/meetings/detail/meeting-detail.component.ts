import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MeetingService } from '../../../core/services/meeting.service';
import { Meeting } from '../../../core/models/meeting.model';

@Component({
    selector: 'app-meeting-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './meeting-detail.component.html',
    styleUrl: './meeting-detail.component.scss'
})
export class MeetingDetailComponent implements OnInit {
    meeting: Meeting | null = null;
    loading = true;
    error = '';
    showDeleteConfirm = false;
    showCancelConfirm = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private meetingService: MeetingService
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) this.loadMeeting(+id);
    }

    loadMeeting(id: number) {
        this.meetingService.getById(id).subscribe({
            next: m => { this.meeting = m; this.loading = false; },
            error: () => { this.error = 'Toplantı bulunamadı.'; this.loading = false; }
        });
    }

    delete() {
        if (!this.meeting) return;
        this.meetingService.delete(this.meeting.id).subscribe({
            next: () => this.router.navigate(['/meetings']),
            error: () => this.error = 'Silme işlemi başarısız.'
        });
    }

    cancelMeeting() {
        if (!this.meeting) return;
        this.meetingService.cancel(this.meeting.id).subscribe({
            next: () => {
                this.meeting!.isCancelled = true;
                this.showCancelConfirm = false;
            },
            error: () => {
                this.error = 'İptal işlemi başarısız.';
                this.showCancelConfirm = false;
            }
        });
    }

    downloadDocument() {
        if (!this.meeting?.document) return;
        const doc = this.meeting.document;
        const byteArray = Uint8Array.from(atob(doc.base64Content), c => c.charCodeAt(0));
        const blob = new Blob([byteArray], { type: doc.fileType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    formatFileSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    formatDate(date: string) {
        return new Date(date).toLocaleDateString('tr-TR', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

    getDuration(): string {
        if (!this.meeting) return '';
        const diff = new Date(this.meeting.endDate).getTime() - new Date(this.meeting.startDate).getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        const rem = mins % 60;
        return hours > 0 ? `${hours} saat ${rem > 0 ? rem + ' dakika' : ''}` : `${mins} dakika`;
    }
}