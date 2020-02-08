import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TabbarComponent } from "./components/category-tabs/tabbar.component";
import { SearchComponent } from "./components/search/search.component";

const routes: Routes = [
	{ path: "", component: TabbarComponent, children: [
		{ path: "Recent", component: TabbarComponent },
		{ path: "People", component: TabbarComponent },
		{ path: "Nature", component: TabbarComponent },
		{ path: "Food", component: TabbarComponent },
		{ path: "Travel", component: TabbarComponent },
		{ path: "Activities", component: TabbarComponent },
		{ path: "Objects", component: TabbarComponent },
		{ path: "Symbols", component: TabbarComponent },
		{ path: "Flags", component: TabbarComponent },
	] },
	{ path: "search", component: SearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
