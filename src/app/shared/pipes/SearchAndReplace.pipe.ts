import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchAndReplace',
})
export class SearchAndReplacePipe implements PipeTransform {
  rgx = /[^a-zA-Z0-9]/;
  transform(
    value: string,
    search: string | RegExp,
    replace: string,
    allCoincidence = false,
  ): string {
    if (!allCoincidence) {
      return value.replace(search, replace);
    }

    return value.replaceAll(search, replace);
  }
}
