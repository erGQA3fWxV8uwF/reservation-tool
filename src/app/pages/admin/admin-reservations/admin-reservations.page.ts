import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { RoomService } from "src/app/core/services/room.service";
import { ThemeService } from "src/app/core/services/theme.service";
import { UserService } from "src/app/core/services/user.service";

@Component({
  selector: 'app-admin-reservations',
  templateUrl: './admin-reservations.page.html',
  styleUrls: ['./admin-reservations.page.sass'],
})
export class AdminReservationsPage implements OnInit {

  storedTheme: string = "theme-light";
  rooms: any[] = [];
  allUser: any[] = [];
  reservations: any[] = [];
  reservationsNew: any[] = [];
  reservationsUser: any[] = [];
  displayedColumns: string[] = ["displayName"];
  allData: any[] = [];
  filterOptions: any[] = [
    {
      value: "name",
      viewValue: this._translateService.instant("RESERVATIONS.NAME"),
    },
    {
      value: "date",
      viewValue: this._translateService.instant("RESERVATIONS.DATE"),
    },
  ];
  selectedFilterOption: string = "name";
  headerCell: string = "";
  currentView: string = "name";
  prevCurrentView: string = "";
  inclOldReservations = false;
  currUserUuid: string = "";
  currUser: number = 0;
  searchTerm: string = "";

  dataSource = new MatTableDataSource<any>();
  userSubscribe: Subscription = new Subscription();
  getRoomsSubscribe: Subscription = new Subscription();
  reservationsSubscribe: Subscription = new Subscription();



  value: any[] = [
    { value: "name", viewValue: this._translateService.instant("RESERVATIONS.NAME") },
    { value: "date", viewValue: this._translateService.instant("RESERVATIONS.DATE") },
  ];
  selectedValue: string = "name";

  oldCurrentView: string = "";
  isChecked = false;
  uid: string = "";
  index: any;
  select: boolean = true;



  constructor(
    private _userService: UserService,
    private _roomService: RoomService,
    private _translateService: TranslateService
    ,    public themeService: ThemeService,


  ) {}

  ngOnInit(): void {
    this.getRoomsSubscribe = this._roomService.rooms.subscribe((rooms: any) => {
      this.rooms = rooms;
    });
    this.userSubscribe = this._userService.users.subscribe((user: any) => {
      this.allUser = user;
      this.allData = user;
      this.loadUser();
    });
  }


  ngOnDestroy(): void {
    this.getRoomsSubscribe.unsubscribe();
    this.userSubscribe.unsubscribe();
  }


  resetData() {
    this.searchTerm = "";
    this.dataSource.data = [];
    this.displayedColumns = ["displayName"];
    this.select = true;
    this.currentView = "name";
    this.loadUser();
  }

  loadUser() {
    if (this.selectedValue === "name") {
      this.currentView = "users";
      this.dataSource.data = this.allUser;
      this.headerCell = "Name";
    } else {
      this.headerCell = "Datum";
      if (this.isChecked == false) {
        this.reservationsSubscribe = this._userService
          .getReservations()
          .subscribe((data) => {
            this.handleReservationsData(data);
          });
      } else {
        this.reservationsSubscribe = this._userService
          .getReservationsWithOld()
          .subscribe((data) => {
            this.handleReservationsData(data);
          });
      }
    }
  }

  handleReservationsData(data: any) {
    this.reservations = data;
    const groupedReservations = this.reservations.reduce((acc, element) => {
      const dateKey = new Date(
        element.date.seconds * 1000
      ).toLocaleDateString();
      const roomKey = element.room;

      if (!acc[dateKey]) {
        acc[dateKey] = {};
      }

      if (!acc[dateKey][roomKey]) {
        acc[dateKey][roomKey] = [];
      }

      acc[dateKey][roomKey].push({
        user: this.getUserName(element.user),
        start: this.formateTime(element.startTime),
        end: this.formateTime(element.endTime),
        roomName: this.getRoomName(element.room),
        desk: element.desks?.length ? Object.keys(element.desks).length : 1,
      });

      return acc;
    }, {});
    this.reservationsNew = Object.keys(groupedReservations).map((dateKey) => ({
      name: dateKey,
      rooms: Object.keys(groupedReservations[dateKey]).map((roomName) => ({
        roomName: this.getRoomName(roomName),
        reservations: groupedReservations[dateKey][roomName],
      })),
    }));
    this.dataSource.data = this.reservationsNew;
    this.allData = this.dataSource.data;
  }

  clickOnDate(index: any) {
    console.log("currentview", this.currentView);
    this.select = false;
    if (this.currentView == "name") {
      this.index = index;
      this.dataSource.data = index.rooms;
      this.headerCell = "Räume";
      this.currentView = "rooms";
      this.oldCurrentView = "name";
      this.displayedColumns = [];
      this.displayedColumns = ["backButton", "displayName"];
    } else if (this.currentView == "users") {
      this.headerCell = "Datum";
      this.uid = index.uid;
      if (this.isChecked == false) {
        this.reservationsSubscribe = this._userService
          .getReservationsForUser(this.uid)
          .subscribe((data) => {
            this.handleDataUser(data);
          });
      } else {
        this.reservationsSubscribe = this._userService
          .getReservationsForUserWithOld(this.uid)
          .subscribe((data) => {
            this.handleDataUser(data);
          });
      }
      this.oldCurrentView = "users";
    } else if (this.currentView == "rooms") {
      this.headerCell = "Name";
      this.dataSource.data = index.reservations;
      this.currentView = "reservations";
      this.displayedColumns = [];
      this.oldCurrentView = "users";
      this.displayedColumns.push(
        "backButton",
        "roomName",
        "displayName",
        "places",
        "startTime",
        "endTime"
      );
    }
    setTimeout(() => {
      console.log("currentviewAFter", this.currentView);
    }, 2000);
  }

  handleDataUser(data: any) {
    this.reservations = data;
    if (!data || data.length === 0) {
      this.reservationsUser = [{ displayName: "keine daten vorhanden " }];
    } else {
      this.reservationsUser = data.map((reservation: any) => ({
        date: new Date(reservation.date.seconds * 1000).toLocaleDateString(),
        room: this.getRoomName(reservation.room),
        start: this.formateTime(reservation.startTime),
        end: this.formateTime(reservation.endTime),
        displayName: this.getUserName(reservation.user),
        desk: reservation.desks ? Object.keys(reservation.desks).length : 1 ,
      }));
    }

    this.dataSource.data = this.reservationsUser;
    this.currentView = "userReservations";
    this.displayedColumns = [
      "backButton",
      "userName",
      "displayName",
      "places",
      "startTime",
      "endTime",
      "room",
    ];
  }

  getRoomName(uuid: string): string {
    const room = this.rooms.find((room) => room.uuid === uuid);
    return room ? room.name : "";
  }
  getUserName(uuid: string): string {
    const user = this.allUser.find((users) => users.uid === uuid);
    return user ? user.displayName : "";
  }

  filterData() {
    if (this.selectedValue === "name") {
      this.dataSource.data = this.allUser.filter((users) =>
        users.displayName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else if (this.selectedValue === "date") {
      this.dataSource.data = this.allData.filter((item) =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.dataSource.data = this.allData;
    }
  }

  formateTime(data: any) {
    data = data.toString();
    if (data.length == 3) {
      data = "0" + data;
    }
    let quarter = data.slice(2, 4)
        
    if (quarter !== "00") {
      quarter = data.slice(2, 4) /25 * 15    //format to minutes
    }

    data = data.slice(0, 2) + ":" + quarter;
    return data;
  }

  backButton() {
    if (this.currentView === "userReservations") {
      this.resetData();
    } else if (this.currentView === "rooms") {
      this.resetData();
    } else if (this.currentView === "reservations") {
      this.dataSource.data = this.index.rooms;
      this.headerCell = "Räume";
      this.currentView = "rooms";
      this.oldCurrentView = "name";
      this.displayedColumns = [];
      this.displayedColumns = ["backButton", "displayName"];
    } else {
      console.log("no match");
      this.clickOnDate(1);
    }
  }
}
