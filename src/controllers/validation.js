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
			return [objectKey, controls[objectKey]];
		});
	}

	controls.reverse();

	controls.map((control) => {
		let rerror;
		let key = control;
		let msg = false;
		let data = false;
		if(Array.isArray(control)){
			key = control[0];
			msg = control[1];
			if(control.length > 2){
				data = control[3];
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
			error = 'Please enter a valid email address';
		}
		return error;
	},
	"required": function(value){
		let error;
		if(!value){
			error = 'Please fill in this field';
		}
		return error;
	},
	"fileRequired": function(files){
		let error;
		if(!files.length){
			error = 'Please fill in this field';
		}
		return error;
	},
	"date": function(value){
		let error;
		if(!value){
			error = 'Please enter a valid date';
		}
		return error;
	}
}