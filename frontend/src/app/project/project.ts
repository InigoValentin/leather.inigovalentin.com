import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProjectService } from '../service/project-service';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../service/util-service';
import { ProjectModel } from '../model/project';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-project', templateUrl: './project.html', styleUrl: './project.scss'
})
export class Project {
    
    project: ProjectModel | undefined;
    apiURL: string = environment.apiUrl;
    utilService: UtilService;
    
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
      private route: ActivatedRoute, private projectService:
      ProjectService, private titleService: Title
    ){
        this.utilService = new UtilService();
    }
    
    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        // Use the id to fetch data or perform actions
        this.projectService.getProject("" + id).subscribe(data => {
            this.project = data;
            this.maxIndex = this.project.images.length;
            this.titleService.setTitle(
              this.project.title + " - " + this.translate.instant('SITE.TITLE')
            );
        });
    }

    /**
     * Opens the gallery.
     *
     * @param index Index of the photo to display
     */
    galleryOpen(index: any){
        let cover: HTMLDivElement = <HTMLDivElement> document.getElementById('gallery-cover');
        let gallery: HTMLDivElement = <HTMLDivElement> document.getElementById('gallery');
        cover.style.display = 'block';
        cover.style.opacity = '0.4';
        gallery.style.display = 'block';
        gallery.style.opacity = '1';
        if (index >= 0 && index <= this.maxIndex){
            this.curIndex = index;
            this.gallerySet();
        }
        else console.error('Invalid image index: ' + index + '/' + this.maxIndex);
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
    
    /**
     * Pupulates the data in the gallery.
     */
    gallerySet(){
        let titleText = document.getElementById('img-' + this.curIndex)?.getAttribute("alt") || "";
        if (titleText != null && titleText.length > 0) titleText = ': ' + titleText;
        else titleText = '';
        let title: HTMLSpanElement = <HTMLSpanElement> document.getElementById('gallery-title');
        let text: HTMLParagraphElement
          = <HTMLParagraphElement> document.getElementById('gallery-text');
        let image: HTMLImageElement = <HTMLImageElement> document.getElementById('gallery-img');
        let video: HTMLVideoElement = <HTMLVideoElement> document.getElementById('gallery-video');
        title.innerHTML = titleText;
        if (document.getElementById('img-' + this.curIndex)?.dataset["video"] == 'true'){
            image.style.display = 'none';
            video.style.display = 'block';
            video.setAttribute(
              "src", document.getElementById('img-' + this.curIndex)?.getAttribute("src") || ""
            );
        }
        else{
            video.pause();
            video.currentTime = 0;
            video.style.display = 'none';
            image.style.display = 'block';
            image.src = document.getElementById('img-' + this.curIndex)?.getAttribute("src") || "";
            image.srcset
              = document.getElementById('img-' + this.curIndex)?.getAttribute("srcset") || "";
        }
        let description: string
          = document.getElementById('img-' + this.curIndex)?.dataset["description"] || "";
        text.innerHTML = description;
        if (description.length > 0) text.style.display = 'block';
        else text.style.display = 'none';
    }

    /**
     * Displays the next photo in the gallery.
     */
    galleryNext(){
        this.curIndex ++;
        if (this.curIndex > this.maxIndex) this.curIndex = 0;
        this.gallerySet();
    }

    /**
     * Displays the previous photo in the gallery.
     */
    galleryPrev(){
        this.curIndex --;
        if (this.curIndex < 0) this.curIndex = this.maxIndex;
        this.gallerySet();
    }
}

