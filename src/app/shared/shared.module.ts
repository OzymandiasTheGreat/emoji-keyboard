import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { SafePipe, SafeResourcePipe } from "./pipes/safe.pipe";
import { EmojiComponent } from './components/';
import { HotkeyDirective } from './directives/';


@NgModule({
	declarations: [
		EmojiComponent,
		SafePipe,
		SafeResourcePipe,
		HotkeyDirective,
	],
	imports: [CommonModule, TranslateModule, FormsModule],
	exports: [
		TranslateModule,
		FormsModule,
		EmojiComponent,
		SafePipe,
		SafeResourcePipe,
		HotkeyDirective,
	],
})
export class SharedModule {}
