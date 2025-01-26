import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { AppProvider } from '.';

function multiLoader(config: ImageLoaderConfig) {
  if (config.src.startsWith('http')) {
    return config.src;
  }

  return `https://res.cloudinary.com/dy8gpozi6/image/upload/${config.src}`;
}

export const imageLoaderProviders: AppProvider = [
  {
    provide: IMAGE_LOADER,
    useValue: multiLoader,
  },
];
