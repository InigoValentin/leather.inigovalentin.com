import { Component } from '@angular/core';
import { version, author, authorURL, sourceSite, sourceURL, license } from '../../../package.json';

@Component({ selector: 'app-footer', templateUrl: './footer.html', styleUrl: './footer.scss' })
export class Footer{
    version: string = version;
    author: string = author;
    authorURL: string = authorURL;
    sourceSite: string = sourceSite;
    sourceURL: string = sourceURL;
    license: string = license;
}
