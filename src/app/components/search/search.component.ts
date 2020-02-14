import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { PaletteComponent } from "../../shared/components";


@Component({
	selector: "app-search",
	templateUrl: "./search.component.html",
	styleUrls: [ "./search.component.scss" ],
})
export class SearchComponent implements OnInit, AfterViewInit {
	@ViewChild("search") input: ElementRef<HTMLInputElement>;
	@ViewChild(PaletteComponent) palette: PaletteComponent;
	private inputSubscription: Subscription;
	private navSubscription: Subscription;
	public query;
	constructor() {}

	ngOnInit() {}

	ngAfterViewInit() {
		this.inputSubscription = fromEvent(this.input.nativeElement, "input").subscribe((e: InputEvent) => {
			this.query = (<HTMLInputElement>e.target).value ? (<HTMLInputElement>e.target).value : null;
		});
		this.navSubscription = fromEvent(this.input.nativeElement, "keydown").subscribe((e: KeyboardEvent) => {
			if (e.key === "ArrowDown") {
				e.preventDefault();
				this.palette.keyManager.setNextItemActive();
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				this.palette.keyManager.setPreviousItemActive();
			} else if (e.key === "Enter") {
				e.preventDefault();
				this.palette.keyManager.activeItem?.click();
			}
		});
	}
}
