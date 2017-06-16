import React from 'react';
import PropTypes from 'prop-types';

const { Component } = React;
const { isFinite, debounce } = _;

const DEFAULT_DEBOUNCE_MS = 200;

class NumericInput extends Component {
  constructor (props) {
    super(props);
    this.fireOnChange = this.fireOnChange.bind(this);
    this.fireOnChange = debounce(this.fireOnChange, DEFAULT_DEBOUNCE_MS);
    this.state = {
      isTyping: false,
      value: String(props.value),
    };
  }

  shouldComponenetUpdate (nextProps, nextState) {
    return nextState.value !== this.state.value;
  }

  onChangeHandler (event) {
    const value = event.target.value.trim();
    const pattern = /^(\-|\+|\.|[0-9])+$/;
    const validString = pattern.exec(value);
    event.target.value = value;
    event.persist();
    if (value === '' || validString) {
      this.fireOnChange(event);
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

  fireOnChange (event) {
    const { onChange } = this.props;
    const value = event.target.value;
    const isFiniteValue = isFinite(Number(value));
    if (isFiniteValue) {
      onChange(event);
    }
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
