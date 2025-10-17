import { Component } from '@angular/core';
import { author } from '../../../package.json';

@Component({ selector: 'app-header', templateUrl: './header.html', styleUrl: './header.scss' })
export class Header{ author: string = author; }
