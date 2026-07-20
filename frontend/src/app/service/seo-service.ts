import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({providedIn: 'root'})

export class SeoService {
  private renderer: Renderer2;
  
  private data: Object = {};
  private modeSet: boolean = false;
  private modeSingle: boolean = true;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.set("@context", "https://schema.org/");
  }
  
  /**
   * Sets the service to insert 
   */
  setModeSingle(){
    if (this.modeSet){
        console.log("The mode is already set to " + (this.modeSingle ? "SINGLE" : "MULTIPLE"));
    }
    this.modeSingle = true;
    this.modeSet = true;
    Object.defineProperty(this.data, 'mainEntity', { value: {}, writable: true });
  }
  
  setModeMultiple(){
      if (this.modeSet){
          console.log("The mode is already set to " + (this.modeSingle ? "SINGLE" : "MULTIPLE"));
      }
      this.modeSingle = false;
      this.modeSet = true;
      Object.defineProperty(this.data, 'mainEntity', { value: {}, writable: true });
    }
  
  set(key: string, value: string){
    Object.defineProperty(this.data, key, { value: value, writable: true });
  }

  render() {
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(this.data);
    this.renderer.appendChild(document.head, script);
  }
}