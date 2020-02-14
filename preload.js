const exec = require("child_process").exec;
const ipc = require("electron").ipcRenderer;


global.IsWayland = false;
let current_user = require("os").userInfo().username;

ipc.invoke("main_window").then((msg) => {
	global.MainWindowId = msg;
});
current_user = current_user === "root" ? process.env.SUDO_USER : current_user
exec("loginctl list-sessions", (err, stdout, stderr) => {
	if (!err) {
		let session;
		for (const line of stdout.split("\n")) {
			if (line.includes(current_user)) {
				session = line.trim().split(/\s/)[0];
			}
		}
		if (session) {
			exec(`loginctl show-session ${session} -p Type`, (err, stdout, stderr) => {
				if (!err && stdout.includes("Type=wayland")) {
					global.IsWayland = true;
				}
			});
		}
	}
});
