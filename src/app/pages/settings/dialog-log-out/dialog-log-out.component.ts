import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { AuthService } from "src/app/core/services/auth.service";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  selector: 'app-dialog-log-out',
  templateUrl: './dialog-log-out.component.html',
  styleUrls: ['./dialog-log-out.component.sass'],
})
export class DialogLogOutComponent {
  storedTheme: string = "theme-light";
  constructor(
    public dialogRef: MatDialogRef<DialogLogOutComponent>,
    public authService: AuthService,
    public themeService: ThemeService,

  ) {}
  closeDialog(): void {
    this.dialogRef.close();
  }

}
