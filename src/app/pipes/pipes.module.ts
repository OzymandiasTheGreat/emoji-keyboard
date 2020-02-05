import { NgModule } from "@angular/core";
import { SafePipe, SafeResourcePipe } from "./safe.pipe";


@NgModule({
	declarations: [
		SafePipe,
		SafeResourcePipe,
	],
	exports: [
		SafePipe,
		SafeResourcePipe,
	],
})
export class SharedPipesModule {}
