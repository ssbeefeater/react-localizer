# react-localizer

### A simple minimal but powerful Internationalization library for react, using the context API


For react 16.3 and above

---

[Installation](#installation)

[Examples](http://ssbeefeater.github.io/react-localizer)

[Usage](#usage)

[Documentation](#documentation)

---

#### Installation

Install with [yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com/)

```sh
yarn add react-localizer
        #or
npm install react-localizer --save
```
---


#### Usage

Just wrap you root App component with the ```LocaleProvider``` and use the ```<Text/>``` component anywhere in your app.

Basic
```javascript
import React,{ Component } from 'react';
import { render } from 'react-dom';
import { LocaleProvider,Text } from 'react-localizer';

const source = {
    hi:'Hello',
    hiUser:'Hello $user',
    onLine:'$onUsers online {plural($onUsers ,["user","users"])}',
    withHtml:'<h1>react-localizer</h1>',
    deep:{
        world:'World',
    },
}
class MyRootComponent extends Component {
    render() {
        return (
            <LocaleProvider language="en" source={source} >
                <Text id="hi" />  // returns Hello
                <Text>deep.world</Text>  // returns World
                <Text id="hiUser" values={{user:'Mike'}}/>  // returns Hello Mike
                <Text values={{onUsers:10}}>onLine</Text>  // returns 10 online users
                <Text values={{onUsers:1}}>onLine</Text>  // returns 1 online user
                <Text id="withHtml" html/>  // returns 1 online user
                <Text>Doesn't exist</Text>  // returns Doesn't exist
                <Text>Doesn't exist</Text>  // returns Doesn't exist
                <Text>Doesn't exist</Text>  // returns Doesn't exist
            </LocaleProvider>
        );
    }
}

render(
    <MyRootComponent/>,
    document.getElementById('app'),
);

```


Dynamic Change Language

```javascript
import React,{ Component } from 'react';
import { render } from 'react-dom';
import { LocaleProvider, withLocale, Text } from 'react-localizer';

const source = {
    hi:'Hello',
    hiUser:'Hello $user',
    onLine:'$onUsers online {plural($onUsers ,["user","users"])}',
    deep:{
        world:'World',
    },
}

// using split code or dynamic import
class MyRootComponent extends Component {
    render() {
        return (
            <LocaleProvider language="en" source={source} importer={(language)=>{
                return import(`./locale/languages/${language}`);
            }}>
                <Text id="hi" />  // returns Hello
            </LocaleProvider>
        );
    }
}

// using any external source code or dynamic import
class MyRootComponent extends Component {
    render() {
        return (
            <LocaleProvider language="en" source={source} importer={(language)=>{
                if(language==='gr'){
                    return axios.get('http://mylang.com/greek').then((resp)=>{
                        return resp.data;
                    })
                }
            }}>
                <Text id="hi" />  // returns Hello
            </LocaleProvider>
        );
    }
}

// using any object
class MyRootComponent extends Component {
    render() {
        return (
            <LocaleProvider language="en" source={source} importer={(language)=>{
                return{test:'Hello world'}
            }}>
                <Text id="hi" />  // returns Hello
            </LocaleProvider>
        );
    }
}

// trigger language change
let Button= (props)=>{
    return (
        <button onClick={()=>props.locale.setLanguage('gr')}>Change to Greek</button>
    )
}

Button = withLocale(Button);

render(
    <MyRootComponent/>,
    document.getElementById('app'),
);

```


Custom pluralize function
```javascript
import React, { Component } from 'react';
import { render } from 'react-dom';
import { LocaleProvider, Text  } from 'react-localizer';
import pluralize from 'pluralize'

const source = {
    oldOnLine: '$onUsers online {plural($onUsers ,["user","users"])}', // before we change pluralize
    newOnLine: '$onUsers online {plural(user, $onUsers)}', // after we change pluralize
}
class MyRootComponent extends Component {
    render() {
        return (

            <LocaleProvider pluralize={(language, args) => { // args will be tha arguments you specified in plural function above
                return pluralize(...args);
            }} language="en" source={source} >
                <Text values={{ onUsers: 10 }}>newOnLine</Text>  // returns 10 online users
                <Text values={{ onUsers: 10 }}>oldOnLine</Text>  // will not work or you must handle it by your self to make it work
            </LocaleProvider>
        );
    }
}

render(
    <MyRootComponent />,
    document.getElementById('app'),
);

```

### Custom text parser
You can define your own text parser and handle the templating for the texts.

```Warning!``` The default templating and plural will not work if you define your own textParser. Ypu must handle this behavior by your self or use a template engine like mustache (not recommended)

```javascript
import React, { Component } from 'react';
import { render } from 'react-dom';
import { LocaleProvider, Text  } from 'react-localizer';
import pluralize from 'pluralize'

const source = {
    awesome: 'Awesome',
    impressive: 'Impressive',
}
class MyRootComponent extends Component {
    render() {
        return (
            <LocaleProvider textParser={(text, values) => `${text} - react-localizer`} language="en" source={source} >
                <Text>awesome</Text>  // returns Awesome - react-localizer
                <Text>impressive</Text>  // return Impressive - react-localizer
            </LocaleProvider>
        );
    }
}

render(
    <MyRootComponent />,
    document.getElementById('app'),
);

```


# Documentation


### withLocale

A function that wraps a component and give access to the locale object through it's props

example:

```javascript
class Button extends React.Component{
    render(){
        const {
            locale,
        } = this.props;
        return (
            <button onClick={()=>locale.setLanguage('gr')}>{locale.get('button.changeLanguage')}</button>
        )
    }
}


export default withLocale(Button);

```
locale:

| propType    | description |
| ------------- | ------------- |
| setLanguage(language: string) | changes the language |
| get(textId: string, values:object) | returns the selected text from source |
| language: string | the current language |


### LocaleProvider

A component intended to wrap the root App or the all the component that need to have localization

example:

```javascript

class App extends React.Component {
    render() {
        return (
            <LocaleProvider language="en" source={{ test: 'Hello world' }}>
                <Text>test</Text>
            </LocaleProvider >
        );
    }
}

```

| propType  | required | default  | description |
| ------------- | ------------- | ------------- | ------------- |
| importer:(language:string)=>Promise({})  | no | - | a function responsible for returning the language recourse when setLanguage will execute |
| language: string) | no | 'en' | the default language |
| source: object | yes | - | the default language source |
| disabled(bool) | no | - | set the form in a disabled state |
| pluralize: (language:string, args:[])=>Promise({}) \| object | no | - | The custom function responsible for pluralizing words |
| textParser: (text:string, values:object)=>string | no | - | The custom function responsible for parsing the text.```Warning``` Plural and default engine that handles variables will not work. You must handle it by your self |

### Text

A component to help you get started using react-localizer. Is responsible for returning the correct value

```javascript

class App extends React.Component {
    render() {
        return (
            <LocaleProvider language="en" source={{ test: 'Hello world' }}>
                <Text>test</Text> // returns 'Hello world'
            </LocaleProvider >
        );
    }
}

```

| propType  | required | default  | description |
| ------------- | ------------- | ------------- | ------------- |
| id: string  | no | - | the word id. If word not found will return the id it self|
| children: string  | no | - | the word id. If word not found will return the id it self|
| component: Function or string | no | 'p' | the component that will wrap the world language source|
| html: boolean  | no | - | Defines when the text is html string|
