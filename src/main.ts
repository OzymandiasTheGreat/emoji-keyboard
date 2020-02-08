import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { AppConfig } from "./environments/environment";
import { TITLEBAR, titlebar, MENUBAR, menubar, APPMENU, appmenu } from "./shared";

if (AppConfig.production) {
	enableProdMode();
}

platformBrowserDynamic([
	{ provide: TITLEBAR, useValue: titlebar },
	{ provide: MENUBAR, useValue: menubar },
	{ provide: APPMENU, useValue: appmenu },
]).bootstrapModule(AppModule, {
	preserveWhitespaces: false,
}).catch(err => console.error(err));
