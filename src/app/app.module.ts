import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from "./app-routing.module";

// Material
import { A11yModule } from "@angular/cdk/a11y";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";

import { AppComponent } from './app.component';
import { TabbarComponent } from "./components/category-tabs/tabbar.component";
import { PaletteComponent } from "./shared/components";
import { SearchComponent } from "./components/search/search.component";
import { SettingsComponent } from './components/settings/settings.component';


@NgModule({
	declarations: [
		AppComponent,
		TabbarComponent,
		PaletteComponent,
		SearchComponent,
		SettingsComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		A11yModule,
		BrowserAnimationsModule,
		CommonModule,
		SharedModule,
		AppRoutingModule,
		MatIconModule,
		MatTabsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSlideToggleModule,
		MatSelectModule,
		MatButtonModule,
		MatDividerModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
