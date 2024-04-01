import { NgClass, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  standalone: true,
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.sass"],
  imports: [
    MatIconModule,
    NgClass,
    NgIf,
    RouterModule,
    
  ]
})
export class NavBarComponent {
  storedTheme: string = "theme-light";
  constructor(public authService: AuthService,     public themeService: ThemeService,
    ) {}

  ngOnInit() {
    this.authService.loadAdminStatus();
  }
}
