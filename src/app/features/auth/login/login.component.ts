import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;
  error = '';

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
      this.auth.login(this.form.value as any).subscribe({
          next: () => {
              this.loading = false;
              this.router.navigate(['/meetings']);
          },
      error: err => {
        this.error = err.error?.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.';
        this.loading = false;
      }
    });
  }

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }
}
