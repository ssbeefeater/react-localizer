import PropTypes from 'prop-types';
import withLocale from './withLocale';
import localeShape from './localeShape';

const upperFirstChar = text => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

const Text = (props) => {
    const {
        text,
        variables,
        children,
        upperCase,
        lowerCase,
        upperFirst,
        nullable = false,
        locale,
    } = props;

    if (typeof (text || children) !== 'string') {
        return text || children || null;
    }

    const txt = locale ? locale.get(text || children, { variables, nullable }) : text || children;

    if (upperCase) {
        return txt && txt.toUpperCase();
    } else if (lowerCase) {
        return txt && txt.toLowerCase();
    }
    if (upperFirst) {
        return txt && upperFirstChar(txt);
    }
    return txt;
};

Text.propTypes = {
    upperCase: PropTypes.bool,
    lowerCase: PropTypes.bool,
    upperFirst: PropTypes.bool,
    nullable: PropTypes.bool,
    text: PropTypes.string,
    values: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    locale: localeShape,
};


export default withLocale(Text);
