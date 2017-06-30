import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isFinite from 'lodash/isFinite';
import debounce from 'lodash/debounce';

const DEFAULT_DEBOUNCE_MS = 100;

const NUMERIC_PATTERN = /^(\-|\+|\.|[0-9])+$/;
const SIGN_PATTERN = /\+|\-/;
const MULTIPLE_SIGNS_PATTERN = new RegExp(SIGN_PATTERN, 'g');
const MULTIPLE_DOTS_PATTERN = /\./g;

class NumericInput extends Component {
  constructor (props) {
    super(props);
    this.fireOnChange = this.fireOnChange.bind(this);
    this.fireOnChange = debounce(this.fireOnChange, DEFAULT_DEBOUNCE_MS);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onKeyPressHander = this.onKeyPressHander.bind(this);
    this.state = {
      isTyping: false,
      value: String(props.value),
      timeout: null,
    };
  }

  shouldComponenetUpdate (nextProps, nextState) {
    return nextState.value !== this.state.value;
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.isTyping) {
      this.setState({
        value: String(nextProps.value),
      });
    }
  }

  componentWillUnmount () {
    const timeout = this.state.timeout;
    if (timeout) {
      clearTimeout(timeout);
    }
  }

  onChangeHandler (event) {
    const value = event.target.value.trim();
    const validString = NUMERIC_PATTERN.test(value);
    event.target.value = value;
    event.persist();
    if (value === '' || validString) {
      const matchDots = value.match(MULTIPLE_DOTS_PATTERN) || [];
      const matchSigns = value.match(MULTIPLE_SIGNS_PATTERN) || [];

      const matchSign = value.match(SIGN_PATTERN);
      const signIdx = matchSign ? matchSign.index : 0;

      if (matchDots.length <= 1 && matchSigns.length <= 1 && signIdx === 0) {
        this.fireOnChange(event);
        this.setState({
          value,
        });
      }
    }
  }

  onFocusHandler () {
    const timeout = this.state.timeout;
    if (timeout) {
      clearTimeout(timeout);
    }
    this.setState({
      isTyping: true,
      timeout: null,
    });
  }

  onBlurHandler () {
    const timeout = setTimeout(() => {
      const { value } = this.props;
      this.setState({
        isTyping: false,
        value,
      });
    }, DEFAULT_DEBOUNCE_MS);
    this.setState({
      timeout,
    });
  }

  onKeyPressHander (event) {
    const { onKeyPress } = this.props;
    onKeyPress(event);
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
        onChange={this.onChangeHandler}
        onFocus={this.onFocusHandler}
        onBlur={this.onBlurHandler}
        onKeyPress={this.onKeyPressHander}
      />
    );
  }
}

NumericInput.propTypes = {
  id: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
};

NumericInput.defaultProps = {
  id: '',
  value: '',
  onChange: () => null,
  onKeyPress: () => null,
  className: '',
  style: {},
  disabled: false,
};

export default NumericInput;
