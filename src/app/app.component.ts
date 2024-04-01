import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";
import { UserService } from "./core/services/user.service";
import { ThemeService } from "./core/services/theme.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  userData?: any;
  storedTheme: any = localStorage.getItem("theme-color");
  selectedValue: string = "en";
  getLanguageSubscribe: Subscription = new Subscription();

  constructor(
    private _authService: AuthService,
    private _translateService: TranslateService,
    private _router: Router,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("user")!);
    if (this.userData === null) {
      this._router.navigate(["/login"]);
    } else {
      this._router.navigate(["/"]);
    }
    this.getLanguage();
    this.loadDarkMode();
  }

  ngOnDestroy(): void {
    this.getLanguageSubscribe?.unsubscribe();
  }



  changeLanguage() {
    this._translateService.use(this.selectedValue);
  }

  getLanguage() {
    this.getLanguageSubscribe = this._authService.angularFireStore
      .collection("users")
      .doc(this.userData?.uid)
      .get()
      .subscribe((doc) => {
        let data: any = doc.data();
        this.selectedValue = data.language;
        this.changeLanguage();
      });
  }
  loadDarkMode() {
    this.themeService.loadDarkMode(this.userData.uid)
    ;
  }
}
