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
 - `P`	- Peach -	Disabled negative numbers (`-1` will be  read `1`), requires implicit importing of the input to the stack when used alone.
 - `B`	- Bowser-	Everything is placed as negative numbers in the stack. Using `BP` is the same as `M`
 - `T`	- Toad  -	Randomly mixed all the value in the stack, every command
 - `Y`	- Yoshi -	All letters will be interpreted as numbers. Adding 2 letters is adding the numbers
 - `K`	- DKong -	Automatically places a quine in the stack. **This clears the stack**

**The order matters!**<br>
`BK` and `KB` work differently.<br>
`BK` receives input and turns into negative numbers, then places the quine.<br>
`KB` places the quine and then it is turned into negative numbers.

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

## Literals

There are a few ways to write literal values:

 - `0-9A-F` - Hexadecimal numbers (E.g.: `F`, `A5`)
 - `a-z` - Literal characters or encoded number (E.g.: `cc`)

## Commands

### Arithmetic

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
 - `«` - Adds *n* bits, with a maximum of 32 bytes.
 - `»` - Removes *n* bits. If the register has less than *n* buts, it will be `0`

### Stack operations

You can also manipulate the stack directly.

Allowed commands:

 - `<` - Takes the first element of the stack and place in the register
 - `>` - Place the value in the registed into the stack, as the first element
 - `!` - Reverses the stack
 - `?` - If the value is `0`, removes it of the stack
 - `=` - Kills the stack

### Blocks and loops

There are a few loops one can do.

**For loop (`|#n`)**

The `for` loop loops a number until it reaches `0`, and will be stored in `#`.

Example:

    P||#9<#|N

Receives no output, disables negative numbers and output from  `9` to `0`.

**For loop (`|$n`)**

Exactly the same as above, but it goes towards *n* instead of towards `0` (as with `|#n`).

**Foreach (`|&`)**

Goes through every element in the stack, storing it in the register.

Example:

    P||#F<#|&*5|N

Outputs the result of multiplying all numbers from `0` to `10`.
