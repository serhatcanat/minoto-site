export function formatNumber(num) {
	return num.toFixed(2).replace('.', ',').toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

export function imageLoad(src, returnFunction, additionalData = null) {
	let img = new Image();
	img.onload = function () {

		returnFunction(additionalData);
	}
	img.src = src;
	if (img.complete) {
		img.onload();
	}
}

export function uid(prefix = 'uid') {
	if (!isDefined(window._uidList)) {
		window._uidList = [];
	}
	let id = getid(prefix);

	return id;

	function getid(prefix) {
		let id = prefix + '_' + Math.random().toString(36).substr(2, 9);

		if (window._uidList.includes(id)) {
			id = getid(prefix);
		}
		return id;
	}
}

export function isDefined(variable) {
	return !(typeof variable === 'undefined' || variable === null);
}