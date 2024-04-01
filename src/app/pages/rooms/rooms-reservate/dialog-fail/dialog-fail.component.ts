import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  standalone: true,
  selector: "app-dialog-fail",
  templateUrl: "./dialog-fail.component.html",
  styleUrls: ["./dialog-fail.component.sass"],
  imports: [MatIconModule,

  ]
})
export class DialogFailComponent {
  storedTheme: string = "theme-light";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,     public themeService: ThemeService,
  ) {}
  errorMessage = this.data.errorText;


}
