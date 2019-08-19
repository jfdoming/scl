import scl from "/js/scl.mjs";

window.addEventListener("load", () => {
	const stdin = document.getElementById("stdin");
	stdin.value = localStorage.getItem("scl-code");
	
	const statusEl = document.getElementById("status");
	statusEl.textContent = "Ready\n";
	
	let lastTimeout = 0;
	stdin.addEventListener("input", () => {
		clearTimeout(lastTimeout);
		lastTimeout = setTimeout(() => localStorage.setItem("scl-code", stdin.value), 2000);
	});
	
	const executeFromStdin = () => {
		try {
			statusEl.textContent = "";
			statusEl.className = "";
			scl.execute(stdin.value, (...args) => args.forEach((arg) => statusEl.textContent += arg));
		} catch (e) {
			statusEl.textContent += e.message && e.message.join ? e.message.join("\n") : e.stack;
			statusEl.className = "error";
			return;
		}

		// If we succeeded, set the status bar state to success.
		const exitCode = 0;
		statusEl.textContent += "Program exited with code " + exitCode;
		statusEl.className = "success";
	};
	
	document.addEventListener("keydown", (e) => {
		if (e.ctrlKey && e.key == "X") {
			executeFromStdin();
		}
	});
	document.getElementById("execute").addEventListener("click", executeFromStdin);
});
