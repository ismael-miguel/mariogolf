# Mario Golf
## Golf programming language based on pipes.
### Run out of pipes and die.

______________________________________________________________________________________

## About Mario

Mario is a stack-based language which pipes information to multiple commands.

Mario has 1 automatic register, where every pop or push is stored.

Each command receives it and processes it individually.

## Syntax

All Mario programs must start with an identifier and a pipe.

Example (shortest valid Mario programs):

    M|O
    P|Q

Valid identifiers and effects:

 - `M`	- Mario -	Normal program, the input is automatically placed in the stack
 - `L`	- Luigi -	Normal program, the input is placed in the stack automatically inverted
 - `P`	- Peach -	Disabled negative numbers (`-1` will be  read `1`), requires explicit importing of the input to the stack when used alone (useful for quines).
 - `B`	- Bowser-	Everything is placed as negative numbers in the stack. Using `BP` is the same as `M`
 - `T`	- Toad  -	Randomly mixed all the value in the stack, every command
 - `Y`	- Yoshi -	All letters will be interpreted as numbers. Adding 2 letters is adding the numbers.

## Return sequences

You are required to use a return sequence.

The return sequence is the last character in the pipeline.<br>
In the examples gived in the point above, it is the last character.

Here are them all (full sequence with `|`):

 - `|O`	- Outputs everything in the stack
 - `|Q`	- Outputs a quine, no code will be executed
 - `||` - Exits and returns whatever is in the stack.
 - `|-` - Returns nothing
 - `|1` - Outputs the `ROT13` version of the stack.
 - `|R` - Outputs the stack, reversed
 - `|N` - Outputs the characters line by line, returning an array
 - `|M` - Outputs the stack as numbers, returns an array

Where not specified, it returns what is in the stack as a string.

Every program is itself a function.

## Commands:

### Arithmetic:

It is possible to do math with Mario.

Examples:

    Y|+c|O
    
Which outputs the sum of the first character and `97`.

List of arithmetic symbols:

 - `+` - Sums the values
 - `/` - Divides the values, returns an integer result
 - `\` - Divides the values, returns the reminder
 - `-` - Substracts the values
 - `*` - Multiplies the values
 - `^` - Multiplies the value in the register *n* times.
