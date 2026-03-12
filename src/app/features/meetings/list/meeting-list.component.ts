import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MeetingService } from '../../../core/services/meeting.service';
import { AuthService } from '../../../core/services/auth.service';
import { Meeting } from '../../../core/models/meeting.model';

@Component({
    selector: 'app-meeting-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './meeting-list.component.html',
    styleUrl: './meeting-list.component.scss'
})
export class MeetingListComponent implements OnInit {
    meetings: Meeting[] = [];
    loading = true;
    error = '';
    errorTimeout: any;
    deleteConfirm: number | null = null;
    user = this.auth.getUser();

    constructor(
        private meetingService: MeetingService,
        private auth: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadMeetings();
    }

    loadMeetings() {
        this.loading = true;
        this.meetingService.getAll().subscribe({
            next: data => { this.meetings = data; this.loading = false; },
            error: () => {
                this.showError('Toplantılar yüklenemedi.');
                this.loading = false;
            }
        });
    }

    confirmDelete(id: number) {
        this.deleteConfirm = id;
    }

    cancelDelete() {
        this.deleteConfirm = null;
    }

    deleteMeeting(id: number) {
        this.meetingService.delete(id).subscribe({
            next: () => {
                this.meetings = this.meetings.filter(m => m.id !== id);
                this.deleteConfirm = null;
            },
            error: () => this.showError('Silme işlemi başarısız.')
        });
    }

    logout() {
        this.auth.logout();
    }

    formatDate(date: string) {
        return new Date(date).toLocaleDateString('tr-TR', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    showError(msg: string) {
        this.error = msg;
        clearTimeout(this.errorTimeout);
        this.errorTimeout = setTimeout(() => this.error = '', 3000);
    }

}
