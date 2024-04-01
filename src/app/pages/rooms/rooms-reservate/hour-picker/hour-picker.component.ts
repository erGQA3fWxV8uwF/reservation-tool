import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from "@angular/core";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  selector: "app-hour-picker",
  templateUrl: "./hour-picker.component.html",
  styleUrls: ["./hour-picker.component.sass"],
})
export class HourPickerComponent {
  storedTheme: string = "theme-light";

  startMinute: number = 0;
  endMinute: number = 0;
  startHour: number = 8;
  endHour: number = 17;

  private _reservationEndDate: any;

  @Input() numberOfReservations?: number;
  @Input() type?: string;
  @Input() passedStartHour?: number;
  @Input() passedStartMinute?: number;
  @Input() passedEndHour?: number;
  @Input() passedEndMinute?: number;
  @Input() quartersEnabled: boolean = false;

  @Output() emitHours: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPanelState: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitEndDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitWhenValue: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,     public themeService: ThemeService,
    ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes["passedStartHour"] &&
      changes["passedStartHour"].currentValue !== undefined
    ) {
      this.startHour = changes["passedStartHour"].currentValue;
    }
    if (
      changes["passedEndHour"] &&
      changes["passedEndHour"].currentValue !== undefined
    ) {
      this.endHour = changes["passedEndHour"].currentValue;
    }
    if (
      changes["passedStartMinute"] &&
      changes["passedStartMinute"].currentValue !== undefined
    ) {
      this.startMinute = changes["passedStartMinute"].currentValue;
    }
    if (
      changes["passedEndMinute"] &&
      changes["passedEndMinute"].currentValue !== undefined
    ) {
      this.endMinute = changes["passedEndMinute"].currentValue;
    }
  }

  ngOnInit(): void {
    if (this.passedStartHour) this.startHour = this.passedStartHour;
    if (this.passedEndHour) this.endHour = this.passedEndHour;
    if (this.passedStartMinute) this.startMinute = this.passedStartMinute;
    if (this.passedEndMinute) this.endMinute = this.passedEndMinute;

    this.emitHours.emit([
      this.startHour,
      this.startMinute,
      this.endHour,
      this.endMinute,
    ]);
  }



  validateHour() {
    const hour = Number(this.endHour);
    if (hour < 0) this.endHour = 23;
    if (isNaN(hour) || hour > 23 || typeof hour != "number") {
      this.endHour = 0;
    }
    this.emitHours.emit([
      this.startHour,
      this.startMinute,
      this.endHour,
      this.endMinute,
    ]);
    this._changeDetectorRef.detectChanges();
  }

  validateMinute() {
    const minute = Number(this.endMinute);
    if (minute < 0) this.endMinute = 45;
    if (isNaN(minute) || minute > 45) {
      this.endMinute = 0;
    }

    this.emitHours.emit([
      this.startHour,
      this.startMinute,
      this.endHour,
      this.endMinute,
    ]);
    this._changeDetectorRef.detectChanges();
  }

  validateHourST() {
    const hour = Number(this.startHour);
    if (hour < 0) this.startHour = 23;
    if (isNaN(hour) || hour > 23 || typeof hour != "number") {
      this.startHour = 0;
    }
    this.emitHours.emit([
      this.startHour,
      this.startMinute,
      this.endHour,
      this.endMinute,
    ]);
    this._changeDetectorRef.detectChanges();
  }

  validateMinuteST() {
    const minute = Number(this.startMinute);
    if (minute < 0) this.startMinute = 45;
    if (isNaN(minute) || minute > 45) {
      this.startMinute = 0;
    }
    this.emitHours.emit([
      this.startHour,
      this.startMinute,
      this.endHour,
      this.endMinute,
    ]);
    this._changeDetectorRef.detectChanges();
  }
  handleEndDate(selectedEndDate: any) {
    this._reservationEndDate = selectedEndDate;
    this.emitEndDate.emit(this._reservationEndDate);
  }
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only numbers, numeric keypad, backspace, tab, enter, delete, and arrow keys
    if (
      charCode > 31 &&
      (charCode < 48 || charCode > 57) &&
      (charCode < 96 || charCode > 105) &&
      (charCode < 37 || charCode > 40) &&
      charCode !== 8 &&
      charCode !== 9 &&
      charCode !== 13 &&
      charCode !== 46
    ) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  meetingStyling() {
    if (this.type == "meeting") {
      return "meetingStyling";
    }
    return "";
  }
}
