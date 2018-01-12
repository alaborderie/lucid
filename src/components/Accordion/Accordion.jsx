import _ from 'lodash';
import React from 'react';
import PropTypes from 'react-peek/prop-types';
import { lucidClassNames } from '../../util/style-helpers';
import { createClass, findTypes, omitProps } from '../../util/component-types';
import { buildHybridComponent } from '../../util/state-management';

import {
	ExpanderPanelDumb as ExpanderPanel,
} from '../ExpanderPanel/ExpanderPanel';

import * as reducers from '../Accordion/Accordion.reducers';

const cx = lucidClassNames.bind('&-Accordion');

const { any, func, object, number, string } = PropTypes;

let propDescriptions;
let componentSummary;

if (process.env.NODE_ENV !== 'production') {
	componentSummary = {
		description: `
			This is a container that renders panels and controls its expansion/retraction.
		`,
		categories: ['layout'],
		madeFrom: ['ExpanderPanel'],
	};

	propDescriptions = {
		className: `
			Appended to the component-specific class names set on the root element.
		`,
		selectedIndex: `
			Indicates which item is expanded
		`,
		onSelect: `
			Called when the user clicks on the component's header of an item.
			Signature: \`(itemIndex, { event, props }) => {}\`
		`,
		style: `
			Passed through to the root element.
		`,
		Header: `
			prop alternative to Header child component
			passed through to the underlying ExpanderPanel
		`,
		mode: `
			TEST: to set the mode of the component.
		`,
		selectedIndices: `
			TEST: list of selected indices for this component
		`,
	};
}

const Accordion = createClass({
	statics: {
		peek: componentSummary,
	},

	displayName: 'Accordion',

	components: {
		Item: ExpanderPanel,
		Header: ExpanderPanel.Header,
	},

	reducers,

	propTypes: PropTypes.applyText(
		{
			className: string,
			selectedIndex: number,
			onSelect: func,
			style: object,
			Header: any,
			mode: PropTypes.oneOf(['large', 'small']).isRequired,
			selectedIndices: PropTypes.arrayOf(string),
		},
		propDescriptions
	),

	_propTypes: {
		className: string`
			Appended to the component-specific class names set on the root element.
		`,

		selectedIndex: number`
			Indicates which item is expanded
		`,

		onSelect: func`
			Called when the user clicks on the component's header of an item.
			Signature: \`(itemIndex, { event, props }) => {}\`
		`,

		style: object`
			Passed through to the root element.
		`,

		Header: any`
			prop alternative to Header child component
			passed through to the underlying ExpanderPanel
		`,

		mode: PropTypes.oneOf(['large', 'small']).isRequired`
			TEST: to set the mode of the component.
		`,

		selectedIndices: PropTypes.arrayOf(string)`
			TEST: list of selected indices for this component
		`,
	},

	getDefaultProps() {
		return {
			onSelect: _.noop,
		};
	},

	handleToggle(isExpanded, index, event) {
		const selectedIndex = isExpanded ? index : null;

		this.props.onSelect(selectedIndex, {
			event,
			props: this.props,
		});
	},

	render() {
		const { style, className, selectedIndex, ...passThroughs } = this.props;

		const itemChildProps = _.map(
			findTypes(this.props, Accordion.Item),
			'props'
		);

		return (
			<div
				{...omitProps(passThroughs, Accordion)}
				className={cx('&', className)}
				style={style}
			>
				{_.map(itemChildProps, (itemChildProp, index) => {
					return (
						<ExpanderPanel
							key={index}
							{...itemChildProp}
							className={cx('&-Item', itemChildProp.className)}
							onToggle={(isExpanded, { event }) =>
								this.handleToggle(isExpanded, index, event)}
							isExpanded={!itemChildProp.isDisabled && selectedIndex === index}
						/>
					);
				})}
			</div>
		);
	},
});

export default buildHybridComponent(Accordion);
export { Accordion as AccordionDumb };
