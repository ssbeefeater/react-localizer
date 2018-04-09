import React from 'react';
import PropTypes from 'prop-types';
import withLocale from './withLocale';
import localeShape from './localeShape';

const Text = (props) => {
    const {
        id,
        values,
        children,
        component: Component,
        locale,
        plurals,
        ...restProps
    } = props;

    const txt = locale.get(String(id || children), values, plurals);
    return (
        <Component {...restProps}>
            {txt}
        </Component>
    );
};

Text.defaultProps = {
    component: 'p',
};

Text.propTypes = {
    id: PropTypes.string,
    values: PropTypes.object,
    plurals: PropTypes.bool,
    component: PropTypes.string,
    children: PropTypes.string,
    locale: localeShape,
};


export default withLocale(Text);
