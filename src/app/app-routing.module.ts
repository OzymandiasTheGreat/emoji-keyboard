import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TabbarComponent } from "./components/category-tabs/tabbar.component";
import { PaletteComponent } from "./shared/components";
import { SearchComponent } from "./components/search/search.component";
import { SettingsComponent } from "./components/settings/settings.component";

const routes: Routes = [
	{ path: "search", component: SearchComponent },
	{ path: "settings", component: SettingsComponent },
	{ path: "", redirectTo: "category", pathMatch: "full" },
	{ path: "category", component: TabbarComponent, children: [
		{ path: "", redirectTo: "/category/(category:Recent)", pathMatch: "full" },
		{ path: "Recent", component: PaletteComponent, outlet: "category" },
		{ path: "People", component: PaletteComponent, outlet: "category" },
		{ path: "Nature", component: PaletteComponent, outlet: "category" },
		{ path: "Food", component: PaletteComponent, outlet: "category" },
		{ path: "Travel", component: PaletteComponent, outlet: "category" },
		{ path: "Activities", component: PaletteComponent, outlet: "category" },
		{ path: "Objects", component: PaletteComponent, outlet: "category" },
		{ path: "Symbols", component: PaletteComponent, outlet: "category" },
		{ path: "Flags", component: PaletteComponent, outlet: "category" },
	] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
