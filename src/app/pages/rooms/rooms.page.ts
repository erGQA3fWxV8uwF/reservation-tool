import { Component, HostListener, OnInit } from "@angular/core";
import { Subscription, combineLatest } from "rxjs";
import { RoomService } from "src/app/core/services/room.service";
import { ThemeService } from "src/app/core/services/theme.service";
@Component({
  selector: "app-rooms",
  templateUrl: "./rooms.page.html",
  styleUrls: ["./rooms.page.sass"],
})
export class RoomsPage implements OnInit {
  storedTheme: string = "theme-light";
  rooms: any[] = [];
  summArray: number[] = [];
  chartLines: number[] = [1, 2, 3];
  dataToday = [];
  chartTimes: string[] = ["08", "12", "16"];
  dataTomorrow = [];
  dataLoaded: boolean = false;
  displayWidth: number = window.innerWidth;

  todaySubscription: Subscription = new Subscription();
  tomorrowSubscription: Subscription = new Subscription();
  getRoomsSubscribe: Subscription = new Subscription();

  constructor(private _roomService: RoomService,     public themeService: ThemeService,
    ) {}

  async ngOnInit() {
    await this.getData().then(() => {
      this.calculateBarHeight(this.displayWidth);
    });
  }

  ngOnDestroy(): void {
    this.getRoomsSubscribe.unsubscribe();
  }


  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.displayWidth = event.target.innerWidth;
    this.calculateBarHeight(this.displayWidth);
  }

  async getData() {
    await new Promise<void>((resolve) => {
      this.getRoomsSubscribe = this._roomService.rooms.subscribe(
        (rooms: any) => {
          this.rooms = rooms;
          resolve();
        }
      );
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const observablesToday = this.rooms.map((room) =>
      this._roomService.getCapacityAtDate(today, room.uuid).pipe()
    );

    const observablesTomorrow = this.rooms.map((room) =>
      this._roomService.getCapacityAtDate(tomorrow, room.uuid).pipe()
    );

    this.todaySubscription = combineLatest(observablesToday).subscribe(
      (allDataToday) => {
        this.dataToday = this.calculatePercentage(allDataToday);
        this.checkDataLoaded();
      }
    );

    this.tomorrowSubscription = combineLatest(observablesTomorrow).subscribe(
      (allDataTomorrow) => {
        this.dataTomorrow = this.calculatePercentage(allDataTomorrow);
        this.checkDataLoaded();
      }
    );
  }

  calculatePercentage(dataOfDayObject: any) {
    const slicedData = dataOfDayObject.map((obj: any) =>
      Object.values(obj).slice(8, 17)
    );

    return slicedData.map((obj: any, index: number) => {
      let sumArray = [];
      if (obj.every((item: any) => typeof item === "number")) {
        return obj;
      } else {
        sumArray = obj.map((desks: any) => {
          return Object.keys(desks).length;
        });
      }
      this.summArray = sumArray;
      return sumArray;
    });
  }

  checkDataLoaded() {
    if (this.dataToday.length > 0 && this.dataTomorrow.length > 0) {
      this.dataLoaded = true;
    }
  }

  setSelectedRoom(room: any) {
    this._roomService.setSelectedRoom(room);
  }

  calculateBarHeight(room: any) {
    if (this.displayWidth < 600) {
      let barHeight = 70 / room.maxCapacity;
      return barHeight;
    }
    if (this.displayWidth < 800) {
      let barHeight = 85 / room.maxCapacity;
      return barHeight;
    } else {
      let barHeight = 100 / room.maxCapacity;
      return barHeight;
    }
  }
  getBarStyle(value: number, room: any) {
    if (value >= room.maxCapacity) {
      return { "background-color": "rgb(244, 5,214)" };
    }
    if (value >= room.maxCapacity / 2) {
      return { "background-color": "rgb(228, 172,26)" };
    } else {
      return { "background-color": "rgb(13, 201,203)" };
    }
  }
}
