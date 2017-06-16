import React from 'react';
import PropTypes from 'prop-types';

const { Component } = React;
const { isFinite } = _;

class NumericInput extends Component {
	constructor (props) {
		super(props);
		this.state = {
			isTyping: false,
			value: String(props.value),
		};
	}

	shouldComponenetUpdate (nextProps, nextState) {
		return nextState.value !== this.state.value;
	}

	onChangeHandler (event) {
		const { onChange } = this.props;
		const value = event.target.value.trim();
		const pattern = /^(\-|\+|\.|[0-9])+$/;
		const validString = pattern.exec(value);
		event.target.value = value;
		if (value === '' || validString) {
			const isFiniteValue = isFinite(Number(value));
			if (isFiniteValue) {
				onChange(event);
			}
			this.setState({
				value,
			});
		}
	}

	onFocusHandler () {
		const { value } = this.props;
		this.setState({
			isTyping: true,
			value,
		});
	}

	onBlurHandler () {
		const { value } = this.props;
		this.setState({
			isTyping: false,
			value,
		});
	}

	render () {
		const {
			value,
			id,
			className,
			style,
			disabled,
			...props
		} = this.props;
		const displayValue = (this.state.isTyping) ? this.state.value : value;
		return (
			<input
				{...props}
				type="text"
				id={id}
				className={className}
				style={style}
				disabled={disabled}
				value={displayValue}
				onChange={(event) => this.onChangeHandler(event)}
				onFocus={() => this.onFocusHandler()}
				onBlur={() => this.onBlurHandler()}
			/>
		);
	}
}

NumericInput.propTypes = {
	id: PropTypes.string,
	value: PropTypes.any,
	onChange: PropTypes.func,
	className: PropTypes.string,
	style: PropTypes.object,
	disabled: PropTypes.bool,
};

NumericInput.defaultProps = {
	id: '',
	value: '',
	onChange: () => null,
	className: '',
	style: {},
	disabled: false,
};

export default NumericInput;
