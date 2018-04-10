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
        html,
        ...restProps
    } = props;

    const txt = locale.get(id || children, values);

    if (html) {
        return <Component {...restProps} dangerouslySetInnerHTML={html && { __html: txt }} />;
    }
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
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    locale: localeShape,
    html: PropTypes.bool,
};


export default withLocale(Text);
