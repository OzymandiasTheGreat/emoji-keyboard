import { Pipe, PipeTransform, Inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";


@Pipe({ name: "safe" })
export class SafePipe implements PipeTransform {
	constructor(@Inject(DomSanitizer) private sanitizer: DomSanitizer) {}

	transform(url) {
		return this.sanitizer.bypassSecurityTrustUrl(url);
	}
}


@Pipe({ name: "safeRes" })
export class SafeResourcePipe implements PipeTransform {
	constructor(@Inject(DomSanitizer) private sanitizer: DomSanitizer) {}

	transform(url) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}
}
