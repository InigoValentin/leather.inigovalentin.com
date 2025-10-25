import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Project } from './project/project';
import { Profile } from './profile/profile';
import { Privacy } from './privacy/privacy';
import { Error } from './error/error';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'projects/:id', component: Project },
  { path: 'profile', component: Profile },
  { path: 'privacy', component: Privacy },
  { path: 'error', component: Error },
  { path: '**', redirectTo: '/error' }
];