import { WebCoverPhotoPickerService } from './WebCoverPhotoPickerService';
import type { ICoverPhotoPickerService } from './ICoverPhotoPickerService';

let instance: ICoverPhotoPickerService = new WebCoverPhotoPickerService();

export function getCoverPhotoPickerService(): ICoverPhotoPickerService {
  return instance;
}

export function setCoverPhotoPickerService(service: ICoverPhotoPickerService): void {
  instance = service;
}
