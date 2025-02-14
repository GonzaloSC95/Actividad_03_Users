import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FormComponent } from './pages/form/form.component';
import { ViewComponent } from './pages/view/view.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'newuser', component: FormComponent },
  { path: 'updateuser/:id', component: FormComponent },
  { path: 'user/:id', component: ViewComponent },
];
