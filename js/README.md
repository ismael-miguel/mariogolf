# Mario Golf Interpreter - Javascript version

## About

This implementation is made thinking about usability.

This is implemented in ES5 and should be compatible with most browsers since IE5.5.

## How to use

To use, simply include the Javascript file *before* attempting to run the code.<br>
The file `mariogolf.min.js` is a minimified version of `mariogolf.js`, being it minimified by hand.

This uses a technique to extract the real `window` object.<br>
It may not work on Node.js or similar.<br>
The  `window` object is used to ensure that the object `MarioGolf` will stay available everywhere.

If you want to test your code, Follow here:<br> http://htmlpreview.github.io/?https://raw.githubusercontent.com/ismael-miguel/mariogolf/master/js/testpage.html <br>
There you can see a quick preview of the HTML testpage.html file with a rudimentar debugging tool.

## Making it work

To implement and make it work, simply create a new instance of the object `MarioGolf`, giving the code as a parameter.

Example:

    var mario = MarioGolf('M|O');

To run, simply call the method `run`:

    mario.run('<input goes here>');

When specified, this method will return the appropriate data or `undefined` otherwise.

The output will be made to a pre-defined function (`console.log()` as the default). It is still stored and accessible through `mario.getOutput()`.

## Exceptions:

This implementation will throw 3 different `SyntaxError` exceptions in the following conditions:

 1. When no valid code is found;
 2. When you have an inconsistent number of `{}`, leading to a missing `{` or `}`;
 3. When a `"` is missing (which means that there isn't an even number).

To be sure that everything goes correctly, use something similar to the following code:

    var mario = MarioGolf( 'M|O' );
    try
    {
        mario.run( 'Cat program FTW!' );
    }
    catch( e )
    {
        if( e instanceOf SyntaxError )
        {
            '<handle error here>';
        }
        else
        {
            '<this means it is another exception (recursion, maybe?)>';
        }
    }

When running, a `ReferenceError` may be throw in very specific cases, when trying to access a pipe that isn't a register, as if it was a value.

Example:

    M||&{+|!}|O

This would trigger the exception since `|!` isn't a valid register.

## Methods

 - `run('<input>')` - Runs the code with the given input. Can be used multiple times.
 - `getStack()` - Returns an array with the content of the stack, after the program finished.
 - `getReturn()` - Returns the last returned value in the code. This may come from a block or after program termination.
 - `getVars()` - Returns an object containing all the values in all the registers. Each key is linked directly to the corresponding register.
 - `getOutput()` - Returns the output produced by the program.
 - `getMemory()` - Returns the content of the memory (variables, registers, input, code, output, ...)
 - `setOutputHandler(<fn>)` - Sets a new function to handle the output.<br>
   Default: `window.console.log`, you can use `document.write`, `window.alert` or an anonymous function<br>
   Only 1 argument will be set, which will contain the output.<br>
   Using `this` inside the output handler will be pointing to `window.console`, so you can do simply `this.log()`.
 - `getVersion()` - Returns the current version.

## Notices

 - You have to create the object again to use it.
 - You can re-use the same object to run the same code for different inputs.<br>
   E.g.: `var mario = MarioGolf('M|O'); mario.run(''); marion.run('multiple'); marion.run('times');`
 - Pay attention to the nesting level of loops.
