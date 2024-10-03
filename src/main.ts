import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { MarvelModule } from './module/marvel.module';


platformBrowserDynamic().bootstrapModule(MarvelModule)
  .catch(err => console.error(err));
