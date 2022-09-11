import { tauri, event } from "@tauri-apps/api";
import { DATA as FULLDATA } from "./data";

const DATA: Record<string, string> = {};
let QUEUE: string[] | null = null;
let TYPING = false;

for (let emoji of FULLDATA.map((group) => group.data).flat()) {
	DATA[emoji.slug] = emoji.char;
}

const handleEvent = ({ payload }: { payload: number }) => {
	const char = String.fromCharCode(payload);
	if (char === ":") {
		if (QUEUE) {
			const kw = QUEUE.join("");
			QUEUE = null;
			const emoji = DATA[kw];
			if (emoji && !TYPING) {
				TYPING = true;
				tauri.invoke("expand", { text: emoji, clear: kw.length + 2 });
				TYPING = false;
			}
		} else {
			QUEUE = [];
		}
	} else if (QUEUE && /^\w$/.test(char)) {
		QUEUE.push(char);
	} else if (char === "\b") {
		QUEUE?.pop();
	} else if (payload !== 0) {
		QUEUE = null;
	}
};

const expansion = async (): Promise<() => void> => {
	const unsub = await event.listen("keypress", handleEvent);
	return () => {
		unsub();
		QUEUE = null;
	};
};

export default expansion;
