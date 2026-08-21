import type { ICoverPhotoPickerService } from './ICoverPhotoPickerService';

export class WebCoverPhotoPickerService implements ICoverPhotoPickerService {
  async openPicker(): Promise<
    | { cancelled: true }
    | { cancelled: false; uri: string; base64?: string; mimeType?: string | null }
  > {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) {
          resolve({ cancelled: true });
          return;
        }
        const dataUrl = await new Promise<string>((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(String(reader.result));
          reader.onerror = () => rej(reader.error);
          reader.readAsDataURL(file);
        });
        const base64 = dataUrl.split(',')[1];
        resolve({
          cancelled: false,
          uri: dataUrl,
          base64,
          mimeType: file.type,
        });
      };
      input.oncancel = () => resolve({ cancelled: true });
      input.click();
    });
  }
}
