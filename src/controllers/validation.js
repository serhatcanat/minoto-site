import cardValidation from 'controllers/card-validation'

export function validation(value, controls = ['required']) {
	let error = false;
	if (controls === true) {
		controls = ['required'];
	}
	// Shorthand for required message
	else if (typeof controls === 'string' || controls instanceof String) {
		controls = [
			['required', controls]
		];
	} else if (!Array.isArray(controls)) {
		controls = Object.keys(controls).map(function (objectKey, index) {
			let data = [controls[objectKey]];
			if (Array.isArray(data[0])) { data = data[0]; }
			return [objectKey, ...data];
		});
	}

	//console.log(controls);

	controls.reverse();

	controls.map((control) => {
		let rerror;
		let key = control;
		let msg = false;
		let data = false;
		if (Array.isArray(control)) {
			key = control[0];
			msg = (control[1] !== true ? control[1] : undefined);
			if (control.length > 1) {
				data = control[2];
			}
		}

		if (validateRaw[key]) {
			if (data !== false) {
				rerror = validateRaw[key](msg, value, data);
			} else {
				rerror = validateRaw[key](msg, value);
			}
		}
		else { rerror = "Hatalı validation: " + key; }

		if (rerror !== undefined) {
			error = rerror;
		}

		return error;
	});

	return error;
}

export const defaultMessages = {
	emailErr: "Geçerli bir e-posta girmelisiniz.",
	fullNameErr: "Geçerli bir ad-soyad girmelisiniz",
	IDErr: "Geçerli bir kimlik no. girmelisiniz.",
	requiredErr: "Bu alanı doldurmalısınız.",
	minNumErr: "Bu alan {amount} değerinden küçük olmamalıdır.",
	maxNumErr: "Bu alan {amount} değerinden büyük olmamalıdır.",
	minLengthErr: "Bu alan en fazla {length} karakter içermelidir.",
	maxLengthErr: "Bu alan en fazla {length} karakter içermelidir.",
	minWordsErr: "Bu alan en az {length} kelime içermelidir.",
	maxWordsErr: "Bu alan en fazla {length} kelime içerebilir.",
	compareErr: "İki alan birbiri ile eşleşmiyor.",
	fileRequiredErr: "Bu alanı doldurmalısınız.",
	dateErr: "Geçerli bir tarih girmelisiniz.",
	creditcardErr: "Geçerli bir kart numarası girmelisiniz.",
	cvcErr: "Geçerli bir CVC numarası girmelisiniz.",
	expiryErr: "Geçerli bir son kullanma tarihi girmelisiniz."
};

const validateRaw = {
	"email": function (msg = defaultMessages.emailErr, value) {
		let error;
		if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
			error = msg;
		}
		return error;
	},
	"fullName": function (msg = defaultMessages.fullNameErr, value) {
		let error;
		if (/\d/.test(value) || value.split(' ').length < 2 || value.replace(' ', '').length < 4) {
			error = msg;
		}
		return error;
	},
	"ID": function (msg = defaultMessages.IDErr, value) {
		let error;
		if (!checkIDNum(value)) {
			error = msg;
		}
		return error;
	},
	"required": function (msg = defaultMessages.requiredErr, value) {
		let error;
		if (!value) {
			error = msg;
		}
		return error;
	},
	"minNum": function (msg = defaultMessages.minNumErr, value, amount, allowFormat = true) {
		let error;
		if (allowFormat) { value = value.toString().replace(/[.,]/g, ''); }
		if (parseFloat(value) < amount) {
			error = msg.replace('{amount}', amount);;
		}
		return error;
	},
	"maxNum": function (msg = defaultMessages.maxNumErr, value, amount, allowFormat = true) {
		let error;
		if (allowFormat) { value = value.toString().replace(/[.,]/g, ''); }
		if (parseFloat(value) > amount) {
			error = msg.replace('{amount}', amount);
		}
		return error;
	},
	"minLength": function (msg = defaultMessages.minLengthErr, value, length) {
		let error;
		if (value && value.length < length) {
			error = msg.replace('{length}', length);;
		}
		return error;
	},
	"maxLength": function (msg = defaultMessages.maxLengthErr, value, length) {
		let error;
		if (value.length > length) {
			error = msg.replace('{length}', length);;
		}
		return error;
	},
	"minWords": function (msg = defaultMessages.minWordsErr, value, length) {
		let error;
		if (value.split(' ').length < length) {
			error = msg.replace('{length}', length);;
		}
		return error;
	},
	"maxWords": function (msg = defaultMessages.maxWordsErr, value, length) {
		let error;
		if (value.split(' ').length > length) {
			error = msg.replace('{length}', length);;
		}
		return error;
	},
	"compare": function (msg = defaultMessages.compareErr, value, compare) {

		let error;
		let compareItem = document.querySelector(compare);
		if (!compareItem || compareItem.value !== value) {
			error = msg;
		}
		return error;
	},
	"fileRequired": function (msg = defaultMessages.compareErr, files) {
		let error;
		if (!files.length) {
			error = msg;
		}
		return error;
	},
	"date": function (msg = defaultMessages.dateErr, value) {
		let error;
		if (!value) {
			error = msg;
		}
		return error;
	},
	"creditcard": function (msg = defaultMessages.creditcardErr, value) {
		let error;
		let status = true
		const reg = new RegExp(/^([0-9]{4} [0-9]{4} [0-9]{4} [0-9]{3,4})$/g);

		if (!reg.test(value)) { status = false; } else (status = cardValidation.check(value.replace(/\s/g, '')));

		if (!status) {
			error = msg;
		}
		return error;
	},
	"cvc": function (msg = defaultMessages.cvcErr, value, length = false) {
		let error;
		let regString = /^([0-9]{3,4})$/g;
		if (length === 3) {
			regString = /^([0-9]{3})$/g;
		} else if (length === 4) {
			regString = /^([0-9]{4})$/g;
		}
		let regex = new RegExp(regString);
		if (!regex.test(value)) {
			error = msg;
		}
		return error;
	},
	"expiry": function (msg = defaultMessages.expiryErr, dateString, gaps = false) {
		let error;
		var curYear = parseInt((new Date()).getFullYear().toString().substr(-2));
		var month = 13;
		var year = 1;
		var dateReg = new RegExp((gaps ? /[0-9]{1,2} \/ [0-9]{1,2}/ : /[0-9]{1,2}\/[0-9]{1,2}/));
		if (dateReg.test(dateString)) {
			var parts = dateString.split((gaps ? " / " : "/"));
			month = parseInt(parts[0], 10);
			year = parseInt(parts[1], 10);
		}

		if (month > 12 || year < 19 || year < (curYear)) {
			error = msg;
		}

		return error;
	}
}

function checkIDNum(tcno) {
	tcno = String(tcno);
	let j;
	let i;
	let hane_tek;
	let hane_cift;

	if (tcno.substring(0, 1) === '0') {
		return false;
	}
	if (tcno.length !== 11) {
		return false;
	}
	let ilkon_array = tcno.substr(0, 10).split('');
	let ilkon_total = hane_tek = hane_cift = 0;

	for (i = j = 0; i < 9; ++i) {
		j = parseInt(ilkon_array[i], 10);
		if (i & 1) { // tek ise, tcnin çift haneleri toplanmalı!
			hane_cift += j;
		} else {
			hane_tek += j;
		}
		ilkon_total += j;
	}
	if ((hane_tek * 7 - hane_cift) % 10 !== parseInt(tcno.substr(-2, 1), 10)) {
		return false;
	}
	ilkon_total += parseInt(ilkon_array[9], 10);
	if (ilkon_total % 10 !== parseInt(tcno.substr(-1), 10)) {
		return false;
	}
	return true;
}
