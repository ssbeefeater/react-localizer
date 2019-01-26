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

##### Basic
```javascript
import React,{ Component } from 'react';
import { render } from 'react-dom';
import { LocaleProvider,Text } from 'react-localizer';

const source = {
    hi:'Hello',
    hiWorld:'hello world',
    hiUser:'Hello $user',
    onLine:'$onUsers online {plural($onUsers ,["user","users"])}',
    deep:{
        world:'World',
    },
}
class MyRootComponent extends Component {
    render() {
        return (
            <LocaleProvider language="en" source={source} >
                <Text text="hi" />  // returns Hello
                <Text upperCase text="hi" />  // returns Hello
                <Text upperCase text="hi" />  // returns HELLO
                <Text lowerCase text="hi" />  // returns hello
                <Text upperFirst text="hiWorld" />  // returns Hello world
                <Text>deep.world</Text>  // returns World
                <Text text="hiUser" variables={{user:'Mike'}}/>  // returns Hello Mike
                <Text variables={{onUsers:10}}>onLine</Text>  // returns 10 online users
                <Text variables={{onUsers:1}}>onLine</Text>  // returns 1 online user
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
[withLocale](#withLocale)

 withLocale is higher order component that gives access to any component, to locale object that contains setLanguage, get function
 and language refers to current language


```javascript
import React, { Component } from 'react';
import { render } from 'react-dom';
import { LocaleProvider, withLocale } from 'react-localizer';

class AnyComponent extends Component{
    render(){
        const { locale, username } = this.props;
        const hiUser = locale.get('hello',{
            variables:{
                user:username
            }
        });
        return(
            <div>
                <span>{hiUser}</span>
                <br/>
                <button onClick={()=>locale.setLanguage('gr')}>Change to Greek</button>
            </div>
        );
    }
}

const MyAnyComponent = withLocale(AnyComponent);


const source = {
    hello:'Hello $user'
}

class MyRootComponent extends Component {
    render() {
        return (
            <LocaleProvider language="en" source={source} importer={()=>{
                    if(language==='gr'){
                        return ({ hello:'Γεια $user'})
                    }
                 }}>
                <MyAnyComponent username="Mike" />
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
                <Text text="hi" />  // returns Hello
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
                <Text text="hi" />  // returns Hello
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
                <Text text="hi" />  // returns Hello
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

A hoc that passes the locale object through it's props

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
| get(textId: string, options: { variables: object, nullable: boolean }) | returns the selected text from source. if options.nullable is true will return null if no text found else will return back the textId. |
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
| importer:(language:string)=>Promise({})  | no | - | a function responsible for returning the language resources when setLanguage will execute |
| language: string) | no | 'en' | the default language |
| source: object | yes | - | the default language source |
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
| text: string  | no | - | the word text. If word not found will return the text or null if nullable prop is true|
| children: string  | no | - | the word text. If word not found will return the text or null if nullable prop is true|
| variables: object | no | - | the variables of the text that will be replaced|
| nullable: boolean  | no | false | if true will return null if the text no found else will return back the text prop|
| lowerCase: boolean  | no | - | return the text in lowerCase |
| upperCase: boolean  | no | - | return the text in upperCase |
| upperFirst: boolean  | no | - | returns the first letter text in upperCase |
