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
        ...restProps
    } = props;

    const txt = locale.get(String(id || children), values);
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
    component: PropTypes.string,
    children: PropTypes.string,
    locale: localeShape,
};


export default withLocale(Text);
