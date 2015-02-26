# Mario Golf Interpreter - Javascript version

## About

This implementation is made thinking about usability.

This is implemented in ES5 and should be compatible with most browsers since IE5.5.

## How to use

To use, simply include the Javascript file *before* attempting to run the code.

This uses a technique to extract the real `window` object.

It shouldn't work on Node.js or similar.

## Making it work

To implement and make it work, simply create a new instance of the object `MarioGolf`, giving the code as a parameter.

Example:

    var mario = MarioGolf('M|O');

To run, simply call the method `run`:

    mario.run('<input goes here>');

When specified, this method will return the appropriate data or `undefined` otherwise.

The output will be made to the console ('`console.log()`'). It is still stored and accessible through `mario.getOutput()`.

## Exceptions:

This implementation will throw 2 different `SyntaxError` exceptions in the following conditions:

 1. When no valid code is found;
 2. When you have an inconsistent number of `{}`, leading to a missing `{` or `}`.

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

## Notices

 - You have to create the object again to use it.
 - You can re-use the same object to run the same code for different inputs.
 - Pay attention to the nesting level of loops.
