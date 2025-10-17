import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Project } from './project/project';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'projects/:id', component: Project }
];