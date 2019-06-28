import defaults from "data/config";

export function setTitle(title, postFix = undefined) {
	if (postFix === undefined) { postFix = defaults.titlePostFix; }
	// const seperator = " | ";
	const seperator = " | ";

	if (title !== "") {
		document.title = title + seperator + postFix;
	}
	else {
		document.title = postFix;
	}
}

export function setMeta(meta, clear = false) {
	let head = document.getElementsByTagName('head')[0];
	let k = 0;
	if (clear) {
		let oldTags = head.querySelectorAll('*[data-dynamic-meta]');
		for (k = 0; k < oldTags.length; k++) {
			head.removeChild(oldTags[k]);
		}
	}

	if (meta) {
		let metaKeys = Object.keys(meta);
		for (k = 0; k < metaKeys.length; k++) {
			let metaObj = document.createElement('META');
			metaObj.name = metaKeys[k];
			metaObj.content = meta[metaKeys[k]];
			metaObj.setAttribute('data-dynamic-meta', 'true');
			head.appendChild(metaObj);
		}
	}
}

export function setHead(meta, clear = false) {
	let head = document.getElementsByTagName('head')[0];
	let k = 0;
	if (clear) {
		let oldTags = head.querySelectorAll('*[data-custom-meta]');
		for (k = 0; k < oldTags.length; k++) {
			head.removeChild(oldTags[k]);
		}
	}

	if (meta) {
		for (k = 0; k < meta.length; k++) {
			let customData = meta[k];
			let customObj = document.createElement(customData.key);
			if (customData.content) { customObj.innerHTML = customData.content }
			let customProps = Object.keys(customData.props);
			for (let p = 0; p < customProps.length; p++) {
				customObj.setAttribute(customProps[p], customData.props[customProps[p]]);
			}
			customObj.setAttribute('data-custom-meta', 'true');
			head.appendChild(customObj);
		}
	}
}