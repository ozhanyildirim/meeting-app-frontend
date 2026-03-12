import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    form = this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    loading = false;
    error = '';
    profileImageBase64: string | null = null;
    profileImagePreview: string | null = null;

    constructor(private fb: FormBuilder, private auth: AuthService, private router:Router) { }

    onProfileImageChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;
        const file = input.files[0];

        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            this.error = 'Profil resmi sadece .jpg, .jpeg, .png olabilir';
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            this.error = 'Profil resmi 2MB\'dan büyük olamaz';
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            this.profileImageBase64 = reader.result as string;
            this.profileImagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    removeProfileImage() {
        this.profileImageBase64 = null;
        this.profileImagePreview = null;
    }

    onSubmit() {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }
        this.loading = true;
        this.error = '';

        const payload = {
            ...this.form.value,
            profileImage: this.profileImageBase64 ?? undefined
        };

        this.auth.register(payload as any).subscribe({
            next: () => {
                this.router.navigate(['/auth/login']);
                this.loading = false;
            },
            error: err => {
                this.error = err.error?.message || 'Kayıt başarısız. Lütfen tekrar deneyin.';
                this.loading = false;
            }
        });
    }

    get firstName() { return this.form.get('firstName')!; }
    get lastName() { return this.form.get('lastName')!; }
    get email() { return this.form.get('email')!; }
    get phone() { return this.form.get('phone')!; }
    get password() { return this.form.get('password')!; }
}