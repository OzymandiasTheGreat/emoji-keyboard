import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject } from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { DataService, IEmoji } from "../../providers/data.service";
import { PaletteComponent } from "../shared/palette/palette.component";


@Component({
	selector: "app-search",
	templateUrl: "./search.component.html",
	styleUrls: [ "./search.component.scss" ],
})
export class SearchComponent implements OnInit, AfterViewInit {
	@ViewChild("search") input: ElementRef<HTMLInputElement>;
	@ViewChild(PaletteComponent) palette: PaletteComponent;
	// private data: DataService;
	results: IEmoji[];
	inputSubscription: Subscription;
	navSubscription: Subscription;
	constructor(@Inject(DataService) private data: DataService) {
		this.data = data;
		this.results = [];
	}

	ngOnInit() {}

	ngAfterViewInit() {
		this.inputSubscription = fromEvent(this.input.nativeElement, "input").subscribe((e) => {
			const query = (<HTMLInputElement>e.target).value ? (<HTMLInputElement>e.target).value : null;
			this.results = this.data.getFilteredEmoji(query);
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
				this.palette.keyManager.activeItem.click(this.palette.keyManager.activeItem.emoji);
			}
		});
	}
}
