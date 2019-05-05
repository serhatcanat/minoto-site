import cardValidation from 'controllers/card-validation'

export function validation(value, controls = ['required']){
	let error = false;

	if(controls === true){
		controls = ['required'];
	}
	// Shorthand for required message
	else if(typeof controls === 'string' || controls instanceof String){
		controls = [['required', controls]];
	}
	else if(!Array.isArray(controls)){
		controls = Object.keys(controls).map(function(objectKey, index) {
			let data = [controls[objectKey]];
			if(Array.isArray(data[0])){ data = data[0]; }

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
		if(Array.isArray(control)){
			key = control[0];
			msg = control[1];
			if(control.length > 1){
				data = control[2];
			}
		}

		if(data !== false){
			rerror = validateRaw[key](value, data);
		}
		else{
			rerror = validateRaw[key](value);
		}

		if(rerror !== undefined){
			error = rerror;
			if(msg){
				error = msg;
			}
		}

		return error;
	});

	return error;
}

const validateRaw = {
	/* Örnek:
	"minLength": function(value, length){
		let error;
		if(value.length < length){
			error = 'Please enter more than ' + length + ' characters';
		}
		return error;
	}
	*/
	"email": function(value){
		let error;
		if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
			error = 'Geçerli bir e-posta girmelisiniz.';
		}
		return error;
	},
	"required": function(value){
		let error;
		if(!value){
			error = 'Bu alanı doldurmalısınız.';
		}
		return error;
	},
	"fileRequired": function(files){
		let error;
		if(!files.length){
			error = 'Bu alanı doldurmalısınız.';
		}
		return error;
	},
	"date": function(value){
		let error;
		if(!value){
			error = 'Geçerli bir tarih girmelisiniz.';
		}
		return error;
	},
	"creditcard": function(value){
		let error;
		let status = true
		const reg = new RegExp(/^([0-9]{4} [0-9]{4} [0-9]{4} [0-9]{3,4})$/g);
		if (!reg.test(value)){ status = false; }
		else (status = cardValidation.check(value.replace(/\s/g, '')));

		if(!status){
			error = 'Geçerli bir kart numarası girmelisiniz.';
		}
		return error;
	},
	"cvc": function(value, length = false){
		let error;
		let regString = /^([0-9]{3,4})$/g;
		if (length === 3) {
			regString = /^([0-9]{3})$/g;
		} else if (length === 4) {
			regString = /^([0-9]{4})$/g;
		}
		let regex = new RegExp(regString);
		if(!regex.test(value)){
			error = 'Geçerli bir CVC numarası girmelisiniz.'
		}
		return error;
	},
	"expiry": function(dateString, gaps = false) {
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
			error = "Geçerli bir son kullanma tarihi girmelisiniz."
		}

		return error;
	},
}