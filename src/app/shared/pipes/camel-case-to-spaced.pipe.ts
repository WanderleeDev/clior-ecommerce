import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToSpaced',
})
export class CamelCaseToSpacedPipe implements PipeTransform {
  transform(value: string, firstLetterUpper = false): string {
    const textFormatter = value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .trim();

    if (!firstLetterUpper) {
      return textFormatter;
    }

    return `${textFormatter.charAt(0).toUpperCase()}${textFormatter.slice(1)}`;
  }
}
