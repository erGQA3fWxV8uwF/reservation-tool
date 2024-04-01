import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getSelectedDate',
  standalone: true,
})
export class GetSelectedDatePipe implements PipeTransform {
  transform(currentYear: number, monthIndex: number, selectedDay?: number): string {
    if (selectedDay !== null) {
      const selectedDate = new Date(currentYear, monthIndex, selectedDay);
      const weekday = selectedDate.toLocaleDateString('default', {
        weekday: 'short'
      });
      const months = selectedDate.toLocaleDateString('default', {
        month: 'short'
      });
      const formattedDate = `${weekday}, ${months}, ${selectedDay}`;
      return formattedDate;
    }
    return '';
  }

  
}

@Pipe({
    name: 'splitIntoRows',
     standalone : true 
  })
  export class SplitIntoRowsPipe implements PipeTransform {
    transform(days: number[], currentYear: number, monthIndex: number): number[][] {
      const rows: number[][] = [];
      let row: number[] = [];
  
      const firstDay = new Date(currentYear, monthIndex, 0).getDay(); // Wochentag des ersten Tages des Monats abrufen
      if (firstDay) {
        // Wenn der erste Tag nicht auf einen Montag fällt, leere Zellen am Anfang hinzufügen
        const emptyCells = Array(firstDay);
        row.push(...emptyCells);
      }
  
      for (const day of days) {
        row.push(day); // Tag zur aktuellen Zeile hinzufügen
        if (row.length === 7) {
          // Wenn die Zeile voll ist (7 Tage), zur Liste der Zeilen hinzufügen und eine neue Zeile erstellen
          rows.push(row);
          row = [];
        }
      }
  
      if (row.length > 0) {
        // Wenn die letzte Zeile nicht vollständig ist, leere Zellen am Ende hinzufügen
        const remainingDays = 7 - row.length;
        row.push(...Array(remainingDays));
        rows.push(row);
      }
  
      return rows; // Liste der Zeilen zurückgeben
    }
  }


@Pipe({
  name: 'dayClass',
  standalone: true 
})
export class DayClassPipe implements PipeTransform {
    transform(day: number, currentYear: number, monthIndex: number, eventData: any[]): string {
        const eventsForDate = eventData;
        const date = new Date(currentYear, monthIndex, day);
        const seconds = date.getTime() / 1000;
        
        const result = eventsForDate.find(
            (eventData) => eventData.date.seconds === seconds
            );
            
            const todaysDateInSeconds = Math.floor(date.getTime() / 1000);
            if (
                eventData &&
                eventData.length > 0 &&
                eventData[0].date.seconds <= todaysDateInSeconds
                ) {
                    if (result == undefined) {
        return "";
      } else {
        return "isReservation";
    }
} else {
    return "";
}
}
}

@Pipe({
    name: 'currentDayClass',
    standalone: true 
})
export class CurrentDayClassPipe implements PipeTransform {
  transform(day: number, currentYear: number, monthIndex: number): string {
    const currentDate = new Date();
    if (
      currentYear === currentDate.getFullYear() &&
      monthIndex === currentDate.getMonth() &&
      day === currentDate.getDate()
    ) {
      return "currentDay";
    } else {
      return "";
    }
  }
}

@Pipe({
    name: 'isDateBeforeToday', standalone: true ,
  })
  export class IsDateBeforeTodayPipe implements PipeTransform {
    transform(date: number, currentYear: number, monthIndex: number): boolean {
      date = date + 1;
      const selectedDate = new Date(currentYear, monthIndex, date);
      const currentDate = new Date();
  
      return selectedDate < currentDate;
    }
  }

