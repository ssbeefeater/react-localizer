import PropTypes from 'prop-types';
import withLocale from './withLocale';
import localeShape from './localeShape';

const Text = (props) => {
    const {
        text,
        values,
        children,
        locale,
    } = props;

    const txt = locale ? locale.get(text || children, values) : text || children;
    return txt;
};

Text.propTypes = {
    text: PropTypes.string,
    values: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    locale: localeShape,
};


export default withLocale(Text);
