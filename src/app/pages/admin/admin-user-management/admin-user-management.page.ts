import { Component } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "src/app/core/services/auth.service";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.page.html',
  styleUrls: ['./admin-user-management.page.sass'],
})
export class AdminUserManagementPage {
  storedTheme: string = "theme-light";
  userData: any[] = [];
  filteredUserData: any[] = [];
  roles: string[] = ["admin", "member", "waiter"];
  searchQuery: string = "";
  displayedColumns: string[] = ["image", "userName", "role"];
  dataSource = new MatTableDataSource<any>();

  constructor(private _authService: AuthService,     public themeService: ThemeService,
    ) {
    (async () => {
      try {
        this.userData = await this._authService.getAllUsers();
        this.filteredUserData = [...this.userData];
      } catch (error) {
        console.log("error getting user-data" + error);
      }
    })();
  }



  filterUsers(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery = filterValue;
    if (this.searchQuery) {
      this.filteredUserData = this.userData.filter(
        (user: { displayName: string; role: string }) =>
          user.displayName.toLowerCase().includes(this.searchQuery) ||
          user.role.toLowerCase().includes(this.searchQuery)
      );
    } else {
      this.filteredUserData = [...this.userData];
    }
  }

  onRoleChange(event: MatSelectChange, user: any) {
    const newRole = event.value;
    console.log(`New role for user ${user.displayName}: ${newRole}`);

    this._authService.updateUserRole(user.uid, newRole);
  }
}
