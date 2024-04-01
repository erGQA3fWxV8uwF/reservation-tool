import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { take } from "rxjs";
import { ThemeService } from "src/app/core/services/theme.service";
import { UserService } from "src/app/core/services/user.service";

@Component({
  selector: "app-dialog-pay",
  templateUrl: "./dialog-pay.component.html",
  styleUrls: ["./dialog-pay.component.sass"],
})
export class DialogPayComponent {
  isCheckboxChecked: boolean = false;
  storedTheme: string = "theme-light";
  unpaidCoffee: any = [];

  constructor(
    private _userService: UserService,
    public themeService: ThemeService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this._userService
      .getUserData(this.data.id)
      .pipe(take(1))
      .subscribe((data: any) => {
        data.coffee.forEach((element: any) => {
          if (element.is_paid == false) {
            this.unpaidCoffee.push(element);
          }
        });
      });
  }

  SubmitPayment() {
    let newCoffeList: any = [];
    if (this.data.id == "abgelaufen") {
      this._userService.updateExpiredPayment(this.data.id);
    } else {
      this._userService
        .getUserCoffeList()
        .pipe(take(1))
        .subscribe((userData) => {
          let users = [];
          users = userData;
          users.forEach((user: any) => {
            if (user.coffee != undefined) {
              console.log(user);

              user.coffee.forEach((coffee: any) => {
                coffee.is_paid = true;
                newCoffeList.push(coffee);
                this._userService.updatePayment(this.data.id, newCoffeList);
              });
            }
          });
        });
    }
  }
}
