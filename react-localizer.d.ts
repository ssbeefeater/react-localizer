/// <reference types="react" />

import { string } from "prop-types";

declare module 'react-localizer' {
    export interface TextProps extends React.HTMLAttributes<any> {
        id?: string;
        values?: { [i: string]: any }
        component?: JSX.Element | React.ReactHTMLElement<any>;
        children?: string | number,
        html?: boolean,
    }
    export const Text: (props: TextProps) => JSX.Element;

    export interface LocaleProviderProps {
        children: any,
        language?: string,
        source: { [i: string]: any },
        importer?: (language: string) => { [i: string]: any },
        pluralize?: (language: string, args: any) => string
        textParser?: (text: string, values: { [i: string]: any }) => string
    }
    export const LocaleProvider: (props: LocaleProviderProps) => JSX.Element;

    export interface Locale {
        get: (textId: string, variables?: { [i: string]: any }) => string;
        setLanguage: (language: string) => void;
        language: string;
    }

    export type WithLocale = {
        locale: Locale
    }

    export const withLocale: <P = any>(component: any) => (props: P) => JSX.Element;
}
