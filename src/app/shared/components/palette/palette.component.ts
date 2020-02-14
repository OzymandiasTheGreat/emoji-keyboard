import { Component, OnInit, AfterViewInit, OnChanges, Input, ViewChildren, QueryList, Inject } from "@angular/core";
import { Observable, of } from 'rxjs';
import { scan } from 'rxjs/operators';
import { Router, Event, NavigationEnd } from "@angular/router";
import { ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { ENTER, SPACE } from "@angular/cdk/keycodes";
import { DataService, RecentService, IEmoji } from "../../../services";
import { EmojiComponent } from "../emoji/emoji.component";


@Component({
	selector: "app-palette",
	templateUrl: "./palette.component.html",
	styleUrls: [ "./palette.component.scss" ],
})
export class PaletteComponent implements OnInit, AfterViewInit, OnChanges {
	@ViewChildren(EmojiComponent) elems: QueryList<EmojiComponent>;
	@Input() query: string | null;
	public items: Observable<IEmoji[]>;
	public keyManager: ActiveDescendantKeyManager<EmojiComponent>;

	constructor(
		@Inject(Router) public router: Router,
		@Inject(DataService) private data: DataService,
		@Inject(RecentService) private recent: RecentService,
	) {
		this.router.events.subscribe((e: Event) => {
			if (e instanceof NavigationEnd) {
				const match = /\/category\/\(category:([A-Z][a-z]+?)\)/g.exec(this.router.url);
				if (match && match[1] !== "Recent") {
					const items = this.data.getEmoji(match[1]);
					this.items = items.pipe(scan((acc, item) => [...acc, item], []));
				} else {
					this.items = recent.observe;
				}
			}
		});
	}

	ngOnInit() {}

	ngAfterViewInit() {
		this.keyManager = new ActiveDescendantKeyManager(this.elems)
			.withHorizontalOrientation('ltr').withWrap();
	}

	ngOnChanges() {
		if (this.router.url.endsWith("search")) {
			if (this.query) {
				this.items = this.data.getFilteredEmoji(this.query).pipe(scan((acc, item) => [...acc, item], []));
			} else {
				this.items = this.recent.observe;
			}
		} else {
			this.items = of([]);
		}
	}

	onKeyDown(event: KeyboardEvent) {
		if ([ENTER, SPACE].includes(event.keyCode)) {
			this.keyManager.activeItem.click();
		} else {
			this.keyManager.onKeydown(event);
		}
	}
}
