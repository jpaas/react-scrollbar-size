import React, { Component, PropTypes } from 'react';
import EventListener from 'react-event-listener';
import isEqual from 'lodash.isequal';

const styles = {
	width: '100px',
	height: '100px',
	position: 'absolute',
	top: '-100000px',
	overflow: 'scroll',
	msOverflowStyle: 'scrollbar',
};

class ScrollbarSizer extends Component {
	static propTypes = {
		onLoad: PropTypes.func,
		onChange: PropTypes.func,
		resizeInterval: PropTypes.number,
	}

	static defaultProps = {
		onLoad: () => {},
		onChange: () => {},
		resizeInterval: 166, // Corresponds to 10 frames at 60 Hz.
	}

	componentDidMount() {
		const {
			onLoad,
		} = this.props;

		this.setMeasurements();
		onLoad(this.measurements);
	}

	componentWillUnmount() {
		clearTimeout(this.deferTimer);
	}

	setMeasurements = () => {
		this.measurements = {
			scrollbarHeight: (this.node.offsetHeight - this.node.clientHeight),
			scrollbarWidth: (this.node.offsetWidth - this.node.clientWidth),
		};
	}

	handleResize = () => {
		clearTimeout(this.deferTimer);
		this.deferTimer = setTimeout(() => {
			const {
				onChange,
			} = this.props;

			const prevMeasurements = this.measurements;
			this.setMeasurements();

			if (!isEqual(prevMeasurements, this.measurements)) {
				onChange(this.measurements);
			}
		}, this.props.resizeInterval);
	}

	render() {
		return (
			<EventListener
				target="window"
				onResize={this.handleResize}
			>
				<div
					style={styles}
					ref={(node) => { this.node = node; }}
				/>
			</EventListener>
		);
	}
}

export default ScrollbarSizer;
