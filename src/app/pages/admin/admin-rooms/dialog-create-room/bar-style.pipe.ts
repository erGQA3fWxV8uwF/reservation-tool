import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'barStyle',
  standalone: true
})
export class BarStylePipe implements PipeTransform {
  maxCapacity: number = 100; // Assuming maxCapacity is defined in the component

  transform(value: number): { [key: string]: string } {
    if (value >= this.maxCapacity) {
      return { "background-color": "rgb(244, 5, 214)" };
    } else if (value >= this.maxCapacity / 2) {
      return { "background-color": "rgb(228, 172, 26)" };
    } else {
      return { "background-color": "rgb(13, 201, 203)" };
    }
  }
}
