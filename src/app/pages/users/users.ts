import { Component, inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HttpClientModule } from '@angular/common/http';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { PaginatorModule } from 'primeng/paginator';


import { ApiService, User } from '../../services/api-service';
import { tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [InputTextModule, TableModule, DialogModule, ButtonModule, RouterLink, ReactiveFormsModule, FormsModule, CommonModule,
    ToastModule, ProgressSpinnerModule, IconFieldModule, InputIconModule, TagModule, PaginatorModule,


  ],
  providers: [MessageService],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {

  private service = inject(ApiService)
  private msgService = inject(MessageService)
  private usersSignal = signal<User[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);


  private paginationSignal = signal<{ page: number; per_page: number; total: number; total_pages: number }>({
    page: 1,
    per_page: 6,
    total: 0,
    total_pages: 0
  });



  selectedUserSignal = signal<User | null>(null);
  user: any = {}
  editUser: any = null

  users = this.usersSignal//.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();
  pagination = this.paginationSignal.asReadonly();

  docs = [{ id: 1, first_name: "asd", last_name: "qwe", email: "as@.com" }]

  loading$ = signal(true);
  error$ = signal<string | null>(null);

  visible: boolean = false;
  show: boolean = false;

  first_name = ""
  last_name = ""
  email = ""

  // editing form
  formEditUser = new FormGroup({
    first_name: new FormControl(this.selectedUserSignal()?.first_name, [Validators.required, Validators.minLength(3)]),
    last_name: new FormControl(this.selectedUserSignal()?.last_name, [Validators.required, Validators.minLength(3)]),
    email: new FormControl(this.selectedUserSignal()?.email, [Validators.required, Validators.email]),
  });

  // new user form
  formNewUser = new FormGroup({
    first_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    last_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });



  get formEditUserControls() {
    return this.formEditUser.controls;
  }


  get formNewUserControls() {
    return this.formNewUser.controls;
  }


  

  ngOnInit() {
    this.loadingSignal.set(true);
    // fetch/get users by api-service
    this.service.getUsers()
      .subscribe({
        next: (sub) => {
          console.log('users:', sub)
          this.usersSignal.set(sub.data)
          this.usersSignal.update((val) => [...val, { avatar: 'https://reqres.in/img/faces/4-image.jpg', first_name: "asd", last_name: "qwe", email: "as@.com" }])
          console.log(' this.usersSignal:', this.usersSignal())
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
          this.paginationSignal.set({
            page: sub.page,
            per_page: sub.per_page,
            total: sub.total,
            total_pages: sub.total_pages
          });
        },
        error: (err) => {
          console.log('error:', err)
          this.errorSignal.set(err.message);
          this.loadingSignal.set(false);

          this.msgService.add({
            severity: 'error',
            summary: 'Error',
            detail: "Cannot load the data!",
            life: 10000
          });
        }
      })

  }

  // display a dialog for updating user
  showEditDialog(user: any) {
    if (user) {
      this.visible = true;
      this.selectedUserSignal.set(user)
      this.user = user
      this.editUser = user;
      console.log('user:', this.user, this.selectedUserSignal())
      this.first_name = user?.first_name
      this.last_name = user?.last_name
      this.email = user?.email
    }

  }

  // display a dialog for new user
  showNewUserDialog() {
    this.show = true;

  }


  onSubmitEditUser() {

    this.service.updateUser(this.selectedUserSignal()?.id, {
      "first_name": this.formEditUser.value.first_name,
      "last_name": this.formEditUser.value.last_name,
      "email": this.formEditUser.value.email,
    }).subscribe((sub) => {
      console.log("updated user:", sub)
      this.usersSignal.update(users =>
        users.map(u => (u.id === this.selectedUserSignal()?.id ? { ...u, ...sub } : u))
      );
      this.msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: "updated a new user successfully",
        life: 10000
      });

    })


    this.visible = false
  }

  onSubmitNewUser() {

    if (this.formNewUser.invalid) {
      this.msgService.add({
        severity: 'error',
        summary: 'Error',
        detail: "create a new user fail! and try again!",
        life: 10000
      });

      return
    }

    this.loading$.set(true);
    this.error$.set(null);

    const { first_name, last_name, email } = this.formNewUser.value;

    console.log('submitted:', { first_name, last_name, email })

    this.service.createUser({
      "first_name": first_name,
      "last_name": last_name,
      "email": email,
    }).subscribe((sub) => {
      console.log("created user:", sub)
      this.usersSignal.update((val) => [...val, { avatar: 'https://reqres.in/img/faces/4-image.jpg', ...sub }])
      this.show = false;

      this.msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: "created a new user successfully",
        life: 10000
      });


    })

  }


  onPageChange(event: any) {
    const page = event.page + 1; // p-paginator uses 0-based index
    const per_page = event.rows;
    console.log('Page change:', { page, per_page });
    //this.userService.fetchUsers(page, per_page).subscribe();
    this.service.getUsers(page, per_page)
      .subscribe({
        next: (sub) => {
          console.log('users:', sub)
          this.usersSignal.set(sub.data)
          console.log(' this.usersSignal:', this.usersSignal())
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
          this.paginationSignal.set({
            page: sub.page,
            per_page: sub.per_page,
            total: sub.total,
            total_pages: sub.total_pages
          });
        },
        error: (err) => {
          console.log('error:', err)
          this.errorSignal.set(err.message);
          this.loadingSignal.set(false);

          this.msgService.add({
            severity: 'error',
            summary: 'Error',
            detail: "Cannot load the data!",
            life: 10000
          });
        }
      })
  }

}
