import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "monthname",
})
export class MonthnamePipe implements PipeTransform {
  transform(seconds: number): any {
    const daysOfWeek = [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
    ];
    const date = new Date(seconds * 1000); // Multipliziere mit 1000, um Millisekunden zu erhalten
    return daysOfWeek[date.getDay()];
  }
}
