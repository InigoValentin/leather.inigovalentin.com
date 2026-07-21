import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { ProjectService } from '../service/project-service';
import { TranslateService, _ } from '@ngx-translate/core';
import { UtilService } from '../service/util-service';
import { ProjectModel } from '../model/project';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-project', templateUrl: './project.html', styleUrls: ['./project.scss']
})
export class Project {
    
    project: ProjectModel | undefined;
    apiURL: string = environment.apiUrl;
    utilService: UtilService;
    private galleryIndexMap = new Map<string, number>();
    
    private translate = inject(TranslateService)
    
    /**
     * Index of the photo currently on the gallery.
     */
    private curIndex: number = -1;

    /**
     * Total number of images.
     */
    private maxIndex: number = -1;

    constructor(
      private route: ActivatedRoute, private projectService: ProjectService, private router: Router,
      private titleService: Title, private metaService: Meta,
      private platformLocation: PlatformLocation
    ){
        this.utilService = new UtilService();
    }
    
    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        // Use the id to fetch data or perform actions
        this.projectService.getProject("" + id).subscribe(
          data => {
            this.project = data;

              if (this.project.images.length === 0) {
                  for (const child of this.project.children) {
                      const childFirstImage = child.images[0];
                      if (childFirstImage) this.project.images.push(childFirstImage);
                  }
              }

            this.buildGalleryIndexMap();
            
            // Set meta tags
            const siteUrl: string = this.platformLocation.protocol + "//" + this.platformLocation.hostname;
            const projectUrl: string = siteUrl + '/projects' + this.project.permalink;
            this.metaService.addTag({ property: 'canonical', content: projectUrl });
            this.metaService.addTag({ property: 'og:url', content: projectUrl });
            this.metaService.addTag({ property: 'og:description', content: this.project.description});
            this.metaService.addTag({ property: 'description', content: this.project.description});
            if (this.project.images.length > 0)
                this.metaService.addTag({ property: 'og:image', content: this.apiURL + this.project.images[0].path });
            else this.metaService.addTag({ property: 'og:image', content: siteUrl + '/img/logo/leather.png' });
            this.translate.get(_('SITE.TITLE')).subscribe((res: string) => {
                this.titleService.setTitle(this.project?.title + " - " + res);
                this.metaService.addTag({ property: 'title', content: this.project?.title + " - " + res });
                this.metaService.addTag({ property: 'og:title', content: this.project?.title + " - " + res });
            });
        },
        err => { this.router.navigate(['/error']); }
      );
    }

    private buildGalleryIndexMap(): void {
        this.galleryIndexMap.clear();
        let index = 1;

        if (!this.project) {
            this.maxIndex = 0;
            return;
        }

        for (const image of this.project.images)
            this.galleryIndexMap.set(this.getProjectImageKey(image.id), index++);

        for (const child of this.project.children ?? []) {
            for (const image of child.images ?? [])
                this.galleryIndexMap.set(this.getChildImageKey(child.id, image.id), index++);
        }

        this.maxIndex = index - 1;
    }

    private getProjectImageKey(imageId: number): string {
        return 'project:' + imageId;
    }

    private getChildImageKey(childId: number, imageId: number): string {
        return 'child:' + childId + ':' + imageId;
    }

    getGalleryIndexForProjectImage(imageId: number): number {
        return this.galleryIndexMap.get(this.getProjectImageKey(imageId)) ?? -1;
    }

    getGalleryIndexForChildImage(childId: number, imageId: number): number {
        return this.galleryIndexMap.get(this.getChildImageKey(childId, imageId)) ?? -1;
    }

    /**
     * Opens the gallery.
     *
     * @param index Index of the photo to display
     */
    galleryOpen(index: any){
        const parsedIndex = Number(index);
        let cover: HTMLDivElement = <HTMLDivElement> document.getElementById('gallery-cover');
        let gallery: HTMLDivElement = <HTMLDivElement> document.getElementById('gallery');
        if (Number.isNaN(parsedIndex)) {
            console.error('Invalid image index: ' + index + '/' + this.maxIndex);
            return;
        }
        cover.style.display = 'block';
        cover.style.opacity = '0.6';
        gallery.style.display = 'flex';
        gallery.style.opacity = '1';
        if (parsedIndex >= 1 && parsedIndex <= this.maxIndex){
            this.curIndex = parsedIndex;
            this.gallerySet();
        }
        else console.error('Invalid image index: ' + parsedIndex + '/' + this.maxIndex);
    }

    /**
     * Closes the gallery.
     */
    galleryClose(){
        let cover: HTMLDivElement = <HTMLDivElement> document.getElementById('gallery-cover');
        let gallery: HTMLDivElement = <HTMLDivElement> document.getElementById('gallery');
        let video: HTMLVideoElement = <HTMLVideoElement> document.getElementById('gallery-video');
        cover.style.display = 'none';
        cover.style.opacity = '0';
        gallery.style.display = 'none';
        gallery.style.opacity = '0';
        video.pause();
        video.currentTime = 0;
    }
    
    private delay(ms: number){ return new Promise(resolve => setTimeout(resolve, ms)); }
    
    /**
     * Pupulates the data in the gallery.
     */
    async gallerySet(){
        var fade = <HTMLDivElement> document.getElementById('gallery-fade');
        fade.style.display = 'block';
        fade.style.opacity = '1';
        await this.delay(200);
        const activeImage = document.getElementById('img-' + this.curIndex);
        const imageTitle = activeImage?.getAttribute('alt') || '';
        const childTitle = activeImage?.dataset['childTitle'] || '';
        let titleText = '';
        if (childTitle.length > 0) titleText += ' - ' + childTitle;
        if (imageTitle.length > 0) titleText += ': ' + imageTitle;
        let title: HTMLSpanElement = <HTMLSpanElement> document.getElementById('gallery-title');
        let text: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById('gallery-text');
        let image: HTMLImageElement = <HTMLImageElement> document.getElementById('gallery-img');
        let video: HTMLVideoElement = <HTMLVideoElement> document.getElementById('gallery-video');
        title.innerHTML = titleText;
        if (document.getElementById('img-' + this.curIndex)?.dataset["video"] == 'true'){
            image.style.display = 'none';
            video.style.display = 'block';
            video.setAttribute("src", document.getElementById('img-' + this.curIndex)?.getAttribute("src") || "");
        }
        else{
            video.pause();
            video.currentTime = 0;
            video.style.display = 'none';
            image.style.display = 'block';
            image.src = document.getElementById('img-' + this.curIndex)?.getAttribute("src") || "";
            image.srcset = document.getElementById('img-' + this.curIndex)?.getAttribute("srcset") || "";
        }
        let description: string = document.getElementById('img-' + this.curIndex)?.dataset["description"] || "";
        text.innerHTML = description;
        if (description.length > 0) text.style.display = 'block';
        else text.style.display = 'none';
        fade.style.opacity = '0';
        await this.delay(200);
        fade.style.display = 'none';
    }

    /**
     * Displays the next photo in the gallery.
     */
    galleryNext(){
        this.curIndex ++;
        if (this.curIndex >= this.maxIndex) this.curIndex = 1;
        this.gallerySet();
    }

    /**
     * Displays the previous photo in the gallery.
     */
    galleryPrev(){
        this.curIndex --;
        if (this.curIndex < 1) this.curIndex = this.maxIndex;
        this.gallerySet();
    }
    
    private swipeCoord?: [number, number];
    private swipeTime?: number;
    
    gallerySwipe(e: TouchEvent, when: string): void {
        const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
        const time = new Date().getTime();
        if (when === 'start') {
            this.swipeCoord = coord;
            this.swipeTime = time;
        }
        else if (this.swipeCoord && this.swipeTime && when === 'end') {
            const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
            const duration = time - this.swipeTime;
            if (duration < 1000 && Math.abs(direction[0]) > 30 && Math.abs(direction[0]) > Math.abs(direction[1] * 3)){ 
                if (direction[0] < 0) this.galleryNext();
                else this.galleryPrev();
            }
        }
    }
}

