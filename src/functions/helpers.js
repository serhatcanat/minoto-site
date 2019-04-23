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

export function serializeArray(form, seperator = ',', ignoreEmpty = false) {
	var serialized = {};
	for (var i = 0; i < form.elements.length; i++) {

		var field = form.elements[i];
		if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

		if (field.type === 'select-multiple') {
			for (var n = 0; n < field.options.length; n++) {
				if (!field.options[n].selected) continue;
				let val = field.options[n].value;

				if(!(ignoreEmpty && val === '')){
					let name = field.name.replace('[]', '');
					if(serialized[name] && name + '[]' === field.name){
						val = serialized[name] +=seperator+val;
					}
					serialized[name] = val;
				}

				//serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
			}
		}

		else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
			let val = field.value;

			if(!(ignoreEmpty && val === '')){
				let name = field.name.replace('[]', '');
				if(serialized[name] && name + '[]' === field.name){
					val = serialized[name] +=seperator+val;
				}
				serialized[name] = val;
			}
			//serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
		}
	}

	return serialized;

};

export function serialize(form, seperator = ',', ignoreEmpty = false) {
	var data = serializeArray(form, seperator, ignoreEmpty);
	var serialized = [];

	for(let k = 0; k < Object.keys(data).length; k++){
		let key = Object.keys(data)[k];
		serialized.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
	}
	return serialized.join('&');
}