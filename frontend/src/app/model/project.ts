import { ProjectImageModel } from './project-image'

export interface ProjectModel{
  id: number;
  permalink: string;
  title: string;
  description: string;
  priority: number;
  images: ProjectImageModel[];
}