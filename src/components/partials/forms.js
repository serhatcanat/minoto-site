import React from 'react';

//Deps
//import omit from 'lodash/omit';
import pick from 'lodash/pick';
import pull from 'lodash/pull';
import union from 'lodash/union';
import extend from 'lodash/extend';
import { uid } from 'functions/helpers';
import { validation } from 'controllers/validation';
import Select from 'components/partials/select'
//import DayPickerInput from 'react-day-picker/DayPickerInput';

//Partials

export class FormInput extends React.Component {
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);

		this.state = {
			error: false,
			touched: false,
			value: false,
		}
	}

	onChange(status) {
		if(this.props.onChange){
			this.props.onChange(this.props.name, status.error);
		}
		this.setState({
			error: status.error,
			touched: status.touched,
			value: status.value,
		});
	}

	render() {
		let vm = this;

		let wrapClasses =
			"inputwrap type-" + vm.props.type +
			(vm.props.className ? ' ' + vm.props.className : '') +
			((vm.state.touched || vm.props.forceTouch) && vm.state.error ? ' error' : '') +
			(vm.props.popLabel ? ' pop-label' : '') +
			(vm.props.disabled ? ' disabled' : '') +
			((vm.state.value !== "" && vm.state.value !== false) ? ' input-full' : '');

		let id = (vm.props.id ? vm.props.id : uid('form_input'));

		let Input = false;
		let inputProps = extend(
			pick(vm.props, ['value', 'label', 'type', 'placeholder', 'name', 'multiple', 'children', 'readOnly', 'onChange', 'decimals', 'wrapperId', 'checked', 'hideError', 'popLabel', 'disabled']),
			{ id: id }
		)

		let validation = vm.props.validation;

		switch (vm.props.type) {
			/*case 'date':
				Input = InputDate;
				break;*/
			case 'checkbox':
				Input = InputCheck;
				break;
			/*case 'radio':
				Input = InputRadio;
			break;*/
			case 'file':
				Input = InputFile;
				if (validation === true || validation === false) {
					validation = (validation ? ['fileRequired'] : false);
				}
				else if (validation === 'required') {
					validation = ['fileRequired'];
				}
				else {
					let reqIndex = validation.indexOf('required');
					if (reqIndex !== -1) {
						validation[reqIndex] = 'fileRequired';
					}
				}
				break;
			case 'select':
				if(vm.props.options){
					inputProps.options = vm.props.options;
				}
				Input = InputSelect;
				break;
			default:
				Input = InputText;
				break;
		}

		return (
			<Input {...{ ...inputProps, ...{ className: wrapClasses, onChange: this.onChange, validation: validation, touched: (vm.props.forceTouch || vm.state.touched) } }} />
		);
	}
}

FormInput.defaultProps = {
	className: '',
	type: "text",
	name: false,
	validation: false,
	multiple: false,
	value: '',
	label: '',
	popLabel: false,
};

class InputText extends React.Component {
	constructor(props) {
		super(props);

		let validateProp = props.validation;
		if (props.type === 'email') {
			if (validateProp === true) {
				validateProp = ['required', 'email'];
			}
		}

		this.state = {
			value: props.value,
			error: false,
			errorMessage: false,
			validations: validateProp,
		}

		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		this.validate(this.state.value, false);
	}

	handleChange(e) {
		let vm = this;
		e.persist();
		//if (vm.props.type !== "number" || e.target.validity.valid) {
			vm.validate(e.target.value, true);
		//}

		/*if (vm.props.onChange) {
			setTimeout(function () {
				vm.props.onChange(e);
			}, 10);
		}*/
	}

	validate(value, touch) {
		let vm = this;
		let validStatus = validation(value, vm.state.validations);
		vm.setState({ value: value, error: (validStatus !== false), errorMessage: validStatus });
		vm.props.onChange({
			error: (validStatus !== false),
			touched: touch,
			value: value,
		});
	}

	render() {
		let vm = this;

		let additionalProps = {};
		let type = vm.props.type;
		if (type === 'number') {
			type = 'text';
			additionalProps = {
				pattern: (vm.props.decimals && vm.props.decimals > 0 ? "[0-9]*(.[0-9]{0,2})?$" : "[0-9]*"),
				inputMode: "numeric",
			}
		}

		let labelText = false;
		if (vm.props.label || (vm.props.popLabel && (vm.props.label || vm.props.placeholder))) {
			labelText = (vm.props.label ? vm.props.label : vm.props.placeholder);
		}

		if (vm.props.readOnly) {
			additionalProps['readOnly'] = true;
		}

		if (vm.props.placeholder) {
			additionalProps.placeholder = vm.props.placeholder + (vm.state.validations !== false ? ' *' : '');
		}

		return (
			<div className={vm.props.className}>
				{labelText &&
					<label className="input-label" htmlFor={vm.props.id}>{labelText}</label>
				}
				<input
					onChange={vm.handleChange}
					value={vm.state.value ? vm.state.value : undefined}
					name={vm.props.name ? vm.props.name : undefined}
					type={type}
					id={vm.props.id ? vm.props.id : undefined}
					disabled={vm.props.disabled ? vm.props.disabled : undefined}
					{...additionalProps}
				/>
				{vm.props.touched && vm.state.error && vm.props.hideError !== true ? (
					<div className="input-error">
						{vm.state.errorMessage}
					</div>
				) : null}
			</div>
		)
	}
}

class InputFile extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: props.value,
			fileNames: '',
			error: false,
			errorMessage: false,
			validations: props.validation,
		}

		this.input = React.createRef();
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		let vm = this;
		let fileNames = '';

		for (let k = 0; k < vm.input.current.files.length; k++) {
			if (k > 0) { fileNames += ', '; }
			fileNames += vm.input.current.files[k].name;
		}

		vm.setState({ fileNames: fileNames })
		vm.validate(vm.input.current.files, vm.input.current.value, true);
	}

	componentDidMount() {
		this.validate(this.input.current.files, this.input.current.value, false);
	}

	validate(files, value, touch) {
		let vm = this;
		let validStatus = validation(files, vm.state.validations);
		vm.setState({ error: (validStatus !== false), errorMessage: validStatus });
		vm.props.onChange({
			error: (validStatus !== false),
			touched: touch,
			value: value,
		});
	}

	render() {
		let vm = this;

		let labelText = false;
		if (vm.props.label || vm.props.placeholder) {
			labelText = (vm.props.label ? vm.props.label : vm.props.placeholder);
		}

		return (
			<div className={vm.props.className}>
				{labelText &&
					<label className="input-label" htmlFor={vm.props.id}>{labelText}</label>
				}
				<i className="input-icon icon-upload"></i>
				<input
					ref={this.input}
					name={vm.props.name}
					onChange={vm.handleChange}
					value={vm.state.value}
					type="file"
					id={vm.props.id}
					multiple={vm.props.multiple}
				/>
				<label htmlFor={vm.props.id}>
					<span></span> {((vm.state.fileNames !== '') ?
						vm.state.fileNames
						: vm.props.placeholder + ((vm.props.placeholder && vm.props.validation !== false) ? ' *' : ''))}
				</label>
				{vm.props.touched && vm.state.error ? (
					<div className="input-error">
						{vm.state.errorMessage}
					</div>
				) : null}
			</div>
		)
	}
}

class InputSelect extends React.Component {
	constructor(props) {
		super(props);

		this.input = React.createRef();
		this.handleChange = this.handleChange.bind(this);
		this.validate = this.validate.bind(this);

		this.state = {
			value: (props.value ? props.value : (props.placeholder ? "" : null)),
			labelText: (props.value ? props.value : (props.placeholder ? props.placeholder : null)),
			error: false,
			errorMessage: false,
		}
	}

	componentDidMount() {
		this.validate(this.state.value);
	}

	handleChange(option) {
		let vm = this;
		//console.log(e);
		vm.validate(option, true);

		if (vm.props.onChange) {
			vm.props.onChange(option);
		}
	}

	validate(option, touch = false) {
		let vm = this;
		let validStatus = validation(option.value, vm.props.validation);
		vm.props.onChange({
			value: (option.value ? option.value : null),
			error: (validStatus !== false),
			touched: touch,
		});

		vm.setState({ value: option, error: (validStatus !== false), errorMessage: validStatus });
	}

	render() {
		let vm = this;

		let labelText = false;
		if (vm.props.label || vm.props.placeholder) {
			labelText = (vm.props.label ? vm.props.label : vm.props.placeholder);
		}

		return (
			<div className={vm.props.className} id={vm.props.wrapperId || ''}>
				{labelText &&
					<label className="input-label" htmlFor={vm.props.id}>{labelText}</label>
				}
				<Select
					value={vm.state.value}
					onChange={vm.handleChange}
					options={vm.props.options}
					id={vm.props.id}
					name={vm.props.name}
					placeholder={vm.props.placeholder}
				/>
				{vm.props.touched && vm.state.error ? (
					<div className="input-error">
						{vm.state.errorMessage}
					</div>
				) : null}
			</div>
		)
	}
}

class InputCheck extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: props.value,
			checked: (props.checked ? true : false),
			error: false,
			errorMessage: false,
		}

		this.input = React.createRef();
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		this.validate(this.state.checked, false);
	}

	handleChange(e) {
		this.validate(e.target.checked, true);
	}

	validate(checked, touch) {
		let vm = this;
		let validStatus = validation((checked ? '1' : ''), vm.props.validation);
		vm.setState({ value: checked, checked: checked, error: (validStatus !== false), errorMessage: validStatus });
		vm.props.onChange({
			error: (validStatus !== false),
			touched: touch,
			value: checked,
		});
	}

	render() {
		let vm = this;

		let inputProps = {
			name: vm.props.name,
			type: "checkbox",
			onChange: vm.handleChange,
			value: vm.state.value,
			id: vm.props.id,
			checked: vm.state.checked,
		}

		return (
			<div className={vm.props.className}>
				<div className="checkwrap">
					<input
						{...inputProps}
					/>
					<label htmlFor={vm.props.id}><span></span> {vm.props.label}</label>
					{vm.props.touched && vm.state.error ? (
						<div className="input-error">
							{vm.state.errorMessage}
						</div>
					) : null}
				</div>
			</div>
		)
	}
}

/*class InputRadio extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: props.value,
		}

		this.input = React.createRef();
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e){
		this.setState({value: e.target.checked});
	}

	render(){
		let vm = this;

		return (
			<div className={vm.props.className}>
				<div className="checkwrap">
					<input
						name={vm.props.name}
						type="radio"
						onChange={vm.handleChange}
						value={vm.state.value}
						id={vm.props.id}
					/>
					<label htmlFor={vm.props.id}><span></span> {vm.props.label}</label>
				</div>
			</div>
		)
	}
}*/

/*class InputDate extends React.Component {
	constructor(props) {
		super(props);

		let validateProp = props.validation;
		if (validateProp === true) {
			validateProp = ['required', 'date'];
		}

		this.state = {
			value: props.value,
			error: false,
			errorMessage: false,
			validations: validateProp
		}

		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		this.validate(this.state.value, false);
	}

	handleChange(value) {
		this.validate(value, true);
	}

	validate(value, touch) {
		let vm = this;
		let validStatus = validation(value, vm.state.validations);
		vm.setState({ value: value, error: (validStatus !== false), errorMessage: validStatus });
		vm.props.onChange({
			error: (validStatus !== false),
			touched: touch,
			value: value,
		});
	}

	render() {
		let vm = this;

		let labelText = false;
		if (vm.props.label || vm.props.placeholder) {
			labelText = (vm.props.label ? vm.props.label : vm.props.placeholder);
		}

		return (
			<div className={vm.props.className}>
				{labelText &&
					<label className="input-label" htmlFor={vm.props.id}>{labelText}</label>
				}
				<i className="input-icon icon-calendar"></i>
				<DayPickerInput
					onDayChange={vm.handleChange}
					inputProps={{
						autoComplete: "off",
						type: "text",
						name: vm.props.name,
						onChange: vm.props.handleChange,
					}}
					value={vm.state.value}
					placeholder={vm.props.placeholder + ((vm.props.placeholder && vm.props.validation !== false) ? ' *' : '')}
				/>

				{vm.state.error && vm.props.touched ? (
					<div className="input-error">{vm.state.errorMessage}</div>
				) : null}
			</div>
		)
	}
}

InputDate.defaultProps = {
	startDate: null,
	dateFormat: "DD/MM/YYYY",
};*/

//// Form Itself

export class InputForm extends React.Component {
	constructor(props) {
		super(props);

		this.validationCount = 0;
		this.state = {
			validElements: [],
			invalidElements: [],
			forceTouch: false
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		this.elementStateChange = this.elementStateChange.bind(this);
	}

	elementStateChange(name, error) {
		let validElems = this.state.validElements;
		let invalidElems = this.state.invalidElements;

		if (error) {
			validElems = pull(validElems, name);
			invalidElems = union(invalidElems, [name]);
		}
		else {
			invalidElems = pull(invalidElems, name);
			validElems = union(validElems, [name]);
		}
		this.setState({ validElements: validElems, invalidElements: invalidElems });
	}

	validate() {
		return (this.state.validElements.length >= this.validationCount);
	}

	handleSubmit(e) {
		e.preventDefault();
		this.setState({ forceTouch: true })
		if (this.validate()) {
			this.setState({ sending: true });

			if(this.props.onSubmit){
				this.props.onSubmit(e.nativeEvent)
			}

		}

	}

	modifyChildren(children, props) {
		return React.Children.map(children, child => {
			if (child !== null) {
				if (!child.props) {
					return child
				}
				if (child.props.name && child.props.type !== "hidden") {
					if (child.props.validation !== false) {
						this.validationCount++;
					}
					let clone = React.cloneElement(child, props);
					return clone;
				}
				if (child.props.children) {
					return React.cloneElement(child, {
						children: this.modifyChildren(child.props.children, props),
					});
				}
				else {
					return child;
				}
			}
		})
	}

	render() {
		let vm = this;
		vm.validationCount = 0;

		return (
			<form className={'form ' + vm.props.className} onSubmit={vm.handleSubmit} noValidate autoComplete={vm.props.autoComplete || ''}>
				{vm.modifyChildren(vm.props.children, { onChange: vm.elementStateChange, forceTouch: vm.state.forceTouch })}
			</form>
		)
	}
}

InputForm.defaultProps = {
	className: '',
	onSubmit: function () { console.log('submitted'); },
};
