import { Component, inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-new-user',
  imports: [InputTextModule, FloatLabelModule, ToastModule, ReactiveFormsModule, FormsModule],
  providers: [MessageService],
  templateUrl: './new-user.html',
  styleUrl: './new-user.scss',
})
export class NewUser {

  private fb = inject(FormBuilder);
  private router = inject(Router)
  private service = inject(ApiService)
  private msgService = inject(MessageService)

  first_name = ''
  last_name = ''
  email = ''

  loading = signal(true);
  error = signal<string | null>(null);

  form = new FormGroup({
    first_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    last_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  goBack() {
       this.router.navigate(['/']);
  }

   get f(){
    return this.form.controls;
  }

  onSubmit(){
   
     if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const { first_name, last_name, email } = this.form.value;

    console.log('submitted:',{ first_name, last_name, email })

    this.service.createUser({
       "first_name": first_name,
       "last_name": last_name,
       "email": email,
    }).subscribe((sub) => {
      console.log("created user:", sub)
      this.msgService.add({
          severity: 'success',
          summary: 'Success',
          detail: "created a new user successfully",
          life: 10000
        });
      
    })
  }

}
