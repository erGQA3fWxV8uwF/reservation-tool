import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  selector: "app-help-dialog",
  templateUrl: "./help-dialog.component.html",
  styleUrls: ["./help-dialog.component.sass"],
})
export class HelpDialogComponent {
  storedTheme: string = "theme-light";
  constructor( translateService: TranslateService,     public themeService: ThemeService,
    ) {}

}
