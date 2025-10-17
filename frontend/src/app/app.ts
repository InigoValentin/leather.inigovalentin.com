import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.None,
})
export class App {
  protected readonly title = signal('frontend');
}
