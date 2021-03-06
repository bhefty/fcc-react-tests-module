/* eslint-disable */
import React from 'react'
import assert from 'assert'
import { mount } from 'enzyme'
import { transform } from 'babel-standalone'

// snippet for defining HTML: <code>&lt;div /&gt;</code>

// SET TO TRUE WHEN QA IS COMPLETE:
export const QA = false;

// ---------------------------- define challenge title ----------------------------
export const challengeTitle = `<span class = 'default'>Challenge: </span>Add Event Listeners`

// ---------------------------- challenge text ----------------------------
export const challengeText = `<span class = 'default'>Intro: </span><code>componentDidMount()</code> is also the best place
to attach any event listeners you need to add for specific functionality. React provides a synthetic event system which wraps
the native event system present in browsers. This means that the synthetic event system behaves exactly the same regardless
of the browser React is being rendered in even if the native events may behave differently between different browsers.
That's great news!<br><br>

You've already been using some of these synthetic event handlers such as <code>onClick()</code>. React's synthetic event system
is great to use for most interactions you will be managing on DOM elements. However, if you want to attach an event handler
to the document or window, you will have to do this directly. That's what we'll do here.`

// ---------------------------- challenge instructions ----------------------------
export const challengeInstructions = `<span class = 'default'>Instructions: </span>Attach an event listener in the
<code>componentDidMount()</code> method for <code>keydown</code> events and have these events trigger the callback
<code>handleKeyPress()</code>. You can use <code>document.addEventListener()</code> which takes the event as the first argument
and the callback as the second argument.<br><br>
	
Then, in <code>componentWillUnmount()</code>, remove this same event listener. You can pass the same arguments to
<code>document.removeEventListener()</code>. It's a good idea to utilize this lifecycle method to do any clean up on React
components before they are unmounted and destroyed. Removing event listeners is a perfect example of one such clean up action.`

// ---------------------------- define challenge seed code ----------------------------
export const seedCode =
`class MyComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: null
		};
	}
	// change code below this line
	componentDidMount() {

	}
	componentWillUnmount() {

	}
	// change code above this line
	handleEnter = () => {
		this.setState({
			message: 'You pressed the enter key!'
		});
	}
	handleKeyPress = (event) => {
    if (event.keyCode === 13) {
    	this.handleEnter();
    }
  }
  render() {
    return (
			<div>
				<h1>{this.state.message}</h1>
			</div>
    );
  }
};`

// ---------------------------- define challenge solution code ----------------------------
export const solutionCode =
`class MyComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: ''
		};
	}
	componentDidMount() {
		// change code below this line
    document.addEventListener('keydown', this.handleKeyPress);
		// change code above this line
	}
	componentWillUnmount() {
		// change code below this line
		document.removeEventListener('keydown', this.handleKeyPress);
		// change code above this line	
	}
	handleEnter = () => {
		this.setState({
			message: this.state.message.concat('You pressed the enter key! ')
		});
	}
	handleKeyPress = (event) => {
    if (event.keyCode === 13) {
    	this.handleEnter();
    }
  }
  render() {
    return (
			<div>
				<h1>{this.state.message}</h1>
			</div>
    );
  }
};`


// ---------------------------- define challenge tests ----------------------------

export const executeTests = (code) => {

	const error_0 = 'Your JSX code was transpiled successfully.';
	const error_1 = 'MyComponent renders a div element which wraps an h1 tag.';
	const error_2 = 'A keydown listener is attached to the document in componentDidMount';
	const error_3 = 'The keydown listener is removed from the document in componentWillUnmount';
	const error_4 = 'Once the component has mounted pressing enter updates its state and the rendered h1 tag.';

	let testResults = [
		{
			test: 0,
			status: false,
			condition: error_0
		},
		{
			test: 1,
			status: false,
			condition: error_1
		},
		{
			test: 2,
			status: false,
			condition: error_2
		},
		{
			test: 3,
			status: false,
			condition: error_3
		},
		{
			test: 4,
			status: false,
			condition: error_4
		}
	];

	let es5, mockedComponent, lifecycle, passed = true;



	// this applies an export to the user's code so
	// we can access their component here for tests
	const exportScript = '\n export default MyComponent'
	const modifiedCode = code.concat(exportScript);
	
	// test 0: try to transpile JSX, ES6 code to ES5 in browser
	try {
		es5 = transform(modifiedCode, { presets: [ 'es2015', 'stage-2', 'react' ] }).code;
		testResults[0].status = true;
	} catch (err) {
		passed = false;
		testResults[0].status = false;
	}
	
	// now we will try to shallow render the component with Enzyme's shallow method
	// you can also use mount to perform a full render to the DOM environment
	// to do this you must import mount above; i.e. import { shallow, mount } from enzyme
	try {
		mockedComponent = mount(React.createElement(eval(es5)));
	} catch (err) {
		passed = false;
	}

	// run specific tests to verify the functionality
	// that the challenge is trying to assess:

	// test 1:
	try {
		assert(
			mockedComponent.find('div').length === 1 &&
			mockedComponent.find('h1').length === 1,
			error_1
		);
		testResults[1].status = true;
	} catch (err) {
		passed = false;
		testResults[1].status = false;
	}

	// test 2:
	try {
		lifecycle = React.createElement(eval(es5)).type.prototype.componentDidMount.toString().replace(/\s/g,'');
		assert(
			lifecycle.includes('document.addEventListener') === true &&
			lifecycle.includes('keydown') === true &&
			lifecycle.includes('handleKeyPress') === true,
			error_2
		);
		testResults[2].status = true;
	} catch (err) {
		passed = false;
		testResults[2].status = false;		
	}

	// test 3:
	try {
		lifecycle = React.createElement(eval(es5)).type.prototype.componentWillUnmount.toString().replace(/\s/g,'');
		assert(
			lifecycle.includes('document.removeEventListener') === true &&
			lifecycle.includes('keydown') === true &&
			lifecycle.includes('handleKeyPress') === true,
			error_3
		);
		testResults[3].status = true;
	} catch (err) {
		passed = false;
		testResults[3].status = false;		
	}

	// test 4:
	try {

		lifecycle = React.createElement(eval(es5)).type.prototype.componentDidMount.toString().replace(/\s/g,'');

		const beforeState = mockedComponent.state('message');
		const beforeText = mockedComponent.find('h1').node.innerText;
		
		mockedComponent.instance().handleKeyPress({ keyCode: 13 });

		const afterState = mockedComponent.state('message');
		const afterText = mockedComponent.find('h1').node.innerText;

		assert(
			beforeState !== afterState &&
			beforeText !== afterText &&
			lifecycle.includes('document.addEventListener') === true &&
			lifecycle.includes('keydown') === true &&
			lifecycle.includes('handleKeyPress') === true,
			error_4			
		);

		testResults[4].status = true;
	} catch (err) {
		passed = false;
		testResults[4].status = false;		
	}	

	return {
		passed,
		testResults
	}
	
}

// ---------------------------- define live render function ----------------------------

export const liveRender = (code) => {

	try {
		const exportScript = '\n export default MyComponent'
		const modifiedCode = code.concat(exportScript);
		const es5 = transform(modifiedCode, { presets: [ 'es2015', 'stage-2', 'react' ] }).code;
		const renderedComponent = React.createElement(eval(es5));
		return renderedComponent;
	} catch (err) {
		console.log('Live rendering failed', err);
	}

}