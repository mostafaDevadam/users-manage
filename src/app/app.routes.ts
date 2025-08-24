import { Routes } from '@angular/router';
import { Users } from './pages/users/users';
import { NewUser } from './pages/new-user/new-user';
import { Detials } from './pages/detials/detials';
import { EditUser } from './pages/edit-user/edit-user';

export const routes: Routes = [
    {path: '', component: Users},
    {path: 'home', component: Users},
    {path: 'new', component: NewUser},
    {path: 'details/:id', component: Detials},
    {path: 'edit/:id', component: EditUser},
];
