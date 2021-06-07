for (let i = 0; i < 20; i++) {
	let btn = document.getElementsByClassName("btnToggle")[i];
	let up = document.createElement("i");
	up.setAttribute("class","fas fa-chevron-up");
	let down = document.createElement("i");
	down.setAttribute("class","fas fa-chevron-down");
	btn.addEventListener("click", function () {
		btn.innerHTML = "";
		let paraDisplay = document.getElementById("paraDisplay" + i);
		if (paraDisplay.getAttribute("class") === "d-none") {
			paraDisplay.setAttribute("class", "d-block");
			btn.append(up);
		} else {
			paraDisplay.setAttribute("class", "d-none");
			btn.append(down);
		}
	});
}