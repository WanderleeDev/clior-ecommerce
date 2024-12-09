import { Component } from "@angular/core";

import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./sidebar.component.html",
  styles: [
    `
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-track {
        background: #1f2937;
      }
      ::-webkit-scrollbar-thumb {
        background: #4b5563;
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
      }
    `,
  ],
})
export class SidebarComponent {
  toggleSidebar() {
    const sidebar = document.getElementById("logo-sidebar");
    sidebar?.classList.toggle("-translate-x-full");
  }
}
