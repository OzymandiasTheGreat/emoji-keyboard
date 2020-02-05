import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./shared/components";
import { EmojiPaletteComponent } from "./components/palette/emoji-palette.component";

const routes: Routes = [
	{
		path: "",
		redirectTo: "Recent",
		pathMatch: "full",
	},
	{
		path: "Recent",
		component: EmojiPaletteComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
