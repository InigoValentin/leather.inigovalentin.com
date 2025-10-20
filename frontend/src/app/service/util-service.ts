import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

/**
 * Provides utilities to use across the app.
 */
export class UtilService {
    
    /**
     * Generates a srcset attribute for an image from it's src.
     * 
     * @param src The image src attribute.
     * @return The computed srcset attribute.
     */
    generateSrcset(src: string): string{
        var srcset: string = "";
        for (let i = 100; i <= 1000; i += 100) srcset += src + "?w=" + i + " " + i + "w, ";
        srcset.substring(0, srcset.length - 1);
        return srcset;
      }
}