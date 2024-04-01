import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fillWhite',
  standalone: true
})
export class FillWhitePipe implements PipeTransform {
  transform(storedTheme: string): any {
    if (storedTheme === 'theme-dark') {
      return { fill: 'white' };
    } else {
      return {};
    }
  }
}
