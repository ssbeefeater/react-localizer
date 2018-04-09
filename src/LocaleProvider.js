import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import LocaleContext from './LocaleContext';
import plural from './plural';


class LocaleProvider extends Component {
    static propTypes = {
        children: PropTypes.any,
        language: PropTypes.string,
        source: PropTypes.object.isRequired,
        importer: PropTypes.func,
        pluralize: PropTypes.func,
    };
    static defaultProps = {
        language: 'en',
    };
    constructor(props) {
        super();
        const { language, source } = props;
        this.plural = props.pluralize || plural;
        this.state = {
            source,
            language,
        };
    }
    setLanguageFromSource = (source, language) => {
        if (source) {
            this.setState({
                source,
                language,
            });
        }
    }
    setLanguage = (language) => {
        if (language !== this.state.language) {
            if (this.props.importer) {
                const importerResult = this.props.importer(language);
                if (importerResult instanceof Promise) {
                    return importerResult.then((sourceResponse) => {
                        const source = (sourceResponse && sourceResponse.default) || sourceResponse;
                        this.setLanguageFromSource(source, language);
                    });
                }
                this.setLanguageFromSource(importerResult, language);

                return Promise.resolve(importerResult, language);
            }
        }
        return Promise.resolve(null, language);
    }
    get = (textKey, values) => {
        let text;
        if (!textKey) return '';
        text = get(this.state.source, textKey);
        if (text && values) {
            text = LocaleProvider.replaceText(text, values);
            text = this.pluralize(text, textKey);
        }
        return text || textKey;
    }
    static replaceText = (text, replaceWith) => {
        if (typeof text !== 'string' || !replaceWith) {
            return text || '';
        }
        let newText = text;
        Object.keys(replaceWith).forEach((key) => {
            newText = newText.replace(new RegExp(`\\$${key}(?![a-zA-Z0-9])`, 'g'), `${replaceWith[key]}`);
        });
        return newText;
    }
    pluralize = (text = '') => {
        let newText = text;
        if (text) {
            const regexp = new RegExp('{ *plural\\((?:[^{]|)*\\) *}', 'g');
            const matchedText = text.match(regexp) || [];
            matchedText.forEach((value) => {
                let pluralArgs = value.replace(/\{\s*plural\(([\s\S]*)\)\s*\}/, '$1');
                pluralArgs = pluralArgs.replace(/\s+/g, '').split(/,(.+)/).filter(val => !!val);
                newText = newText.replace(value, this.plural(this.state.language, pluralArgs));
            });
        }
        return newText;
    }
    render() {
        return (
            <LocaleContext.Provider value={{
                setLanguage: this.setLanguage,
                get: this.get,
                language: this.state.language,
            }}>
                {this.props.children}
            </LocaleContext.Provider>
        );
    }
}

export default LocaleProvider;
