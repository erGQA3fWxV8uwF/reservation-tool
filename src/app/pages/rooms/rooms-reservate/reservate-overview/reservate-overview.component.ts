import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { RoomService } from "src/app/core/services/room.service";

@Component({
  selector: 'app-reservate-overview',
  templateUrl: './reservate-overview.component.html',
  styleUrls: ['./reservate-overview.component.sass'],
})
export class ReservateOverviewComponent implements OnInit {
  selectedRoom: any;
  pageTitle: string = "BOOKING";
  getRoomsSubscribe: Subscription = new Subscription();

  rooms: any[] = [];

  constructor(private _roomService: RoomService,) {}

  ngOnInit(): void {
    this.getRoomsSubscribe = this._roomService.rooms.subscribe((rooms: any) => {
      this.rooms = rooms;
    });
  }
  ngOnDestroy(): void {
    this.getRoomsSubscribe.unsubscribe();
  }

  setSelectedRoom(room: any) {
    this._roomService.setSelectedRoom(room);
  }
}
