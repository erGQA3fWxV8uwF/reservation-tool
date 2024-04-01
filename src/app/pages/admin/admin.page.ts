import { Component } from "@angular/core";
import { AuthService } from "src/app/core/services/auth.service";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  selector: "app-admin-hub",
  templateUrl: "./admin.page.html",
  styleUrls: ["./admin.page.sass"],
})
export class AdminPage {
  storedTheme: string = "theme-light";
  constructor(public authService: AuthService,    public themeService: ThemeService,
    ) {}

  ngOnInit() {
    this.authService.loadAdminStatus();
  }



}
