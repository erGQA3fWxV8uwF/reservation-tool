import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "src/app/core/services/auth.service";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.sass"],
})
export class LoginPage {
  storedTheme: string = "theme-light";

  constructor(
    private _snackBar: MatSnackBar,
    public authService: AuthService,
    public router: Router,
    private _translateService: TranslateService,
    public themeService: ThemeService,

  ) {}



  ngOnInit(): void {
    if (this.authService.isLoggedIn == true) {
      this.router.navigate([""]);
    }
  }
  async checkLoginStatus() {
    await this.authService.authenticateWithGoogleHD();
    if (this.authService.isLoggedIn == true) {
      this.router.navigate([""]);
    } else {
      this.openFailSnackbar();
    }
    this.router.navigate([""]);
  }
  openFailSnackbar() {
    const translatedMessage = this._translateService.instant(
      "MANAGEROOMS.SNACKBAR2"
    );

    this._snackBar.open(translatedMessage, "", {
      panelClass: "fail-snackbar",
      duration: 3500,
    });
  }
}
