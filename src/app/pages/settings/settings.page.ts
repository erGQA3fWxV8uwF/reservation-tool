import { Component, EventEmitter, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { Subscription, take } from "rxjs";
import { UserService } from "src/app/core/services/user.service";

import { AuthService } from "src/app/core/services/auth.service";
import { DialogLogOutComponent } from "./dialog-log-out/dialog-log-out.component";
import { ThemeService } from "src/app/core/services/theme.service";

interface Language {
  value: string;
  viewValue: string;
}
@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.sass"],
})
export class SettingsPage {
  userUuid: string = "";
  userData: any;
  isDark: boolean = false;
  coffeeData: any = [];
  selectedValue: any;
  coffeeValue: number = 0;
  userDataCoffee: any[] = [];
  unpaidCoffee = 0;

  getRoomsSubscribe: Subscription = new Subscription();
  coffeListSubscribe: Subscription = new Subscription();

  languages: Language[] = [
    { value: "en", viewValue: "English" },
    { value: "de", viewValue: "Deutsch" },
    { value: "fr", viewValue: "Français" },
  ];
  @Output() emitTheme: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    public authService: AuthService,
    private _matDialog: MatDialog,
    private _translateService: TranslateService,
    private _userService: UserService, 
       public themeService: ThemeService,

  ) {}

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("user")!);
    this.getLanguage();
this.checkDarkmodeState();

    const user = JSON.parse(localStorage.getItem("user")!);
    this.userUuid = user.uid;

    this.coffeeData = [];

    let userData: any = [];

    this.coffeListSubscribe = this._userService
      .getUserData(this.userUuid)
      .pipe(take(1))
      .subscribe((data) => {
        userData.push(data);
        if (userData[0].coffee.length != 0) {
          userData[0].coffee.forEach((element: any) => {
            this.coffeeData.push(element);
          });
        }
        this.checkIfCoffeePaid();
      });
  }



  ngOnDestroy(): void {
    this.getRoomsSubscribe.unsubscribe();
    this.coffeListSubscribe.unsubscribe();
  }

  openDialog(): void {
    const dialogRef = this._matDialog.open(DialogLogOutComponent, {
      width: "80%",
      height: "auto",
      maxWidth: "600px",
    });
  }



  addCoffee() {
    this.coffeeData.push({ date: new Date(), is_paid: false });
    this._userService.updateCoffeeList(this.userUuid, this.coffeeData);
    this.checkIfCoffeePaid();
  }

  checkIfCoffeePaid() {
    this.unpaidCoffee = 0;
    for (let index1 = 0; index1 < this.coffeeData.length; index1++) {
      if (this.coffeeData[index1].is_paid == false) {
        this.unpaidCoffee++;
      } else this.unpaidCoffee = 0;
    }
  }

  changeLanguage() {
    this._translateService.use(this.selectedValue);
    this.saveLanguage();
  }

  saveLanguage() {
    this.authService.angularFireStore
      .collection("users")
      .doc(this.userData.uid)
      .set(
        {
          language: this.selectedValue,
        },
        { merge: true }
      );
  }

  getLanguage() {
    this.getRoomsSubscribe = this.authService.angularFireStore
      .collection("users")
      .doc(this.userData.uid)
      .get()
      .subscribe((doc) => {
        let data: any = doc.data();
        this.selectedValue = data?.language;
      });
  }

  setTheme() {
    this.themeService.setDarkMode(this.userUuid, this.isDark);
  }

checkDarkmodeState() {
    if (this.themeService.storedTheme$() === "theme-dark") {
      this.isDark = true;
    } else {
      this.isDark = false;
    }
  }
}
