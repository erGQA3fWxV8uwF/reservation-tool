import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  standalone : true ,
  selector: "app-dialog-succesfull",
  templateUrl: "./dialog-succesfull.component.html",
  styleUrls: ["./dialog-succesfull.component.sass"],
  imports : [ 
    MatIconModule,
    TranslateModule,
  ]
})
export class DialogSuccesfullComponent {
  storedTheme: string = "theme-light";
  constructor(public dialogRef: MatDialogRef<DialogSuccesfullComponent>,     public themeService: ThemeService,
    ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

}
