# Mario Golf
## Golf programming language based on pipes.
### Run out of pipes and die.

______________________________________________________________________________________

## About Mario

Mario is a stack-based language which pipes information to multiple commands.

Mario has 2 automatic registers, being `R` the returned value of some operation/function and `I` the register of a loop.<br>
Also, the register `Z` contains the last returned value from a block, while `L` contains the length of the stack.

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
 - `T`	- Toad  -	Randomizes the content of the stack
 - `Y`	- Yoshi -   Normal program, starts with an empty stack
 - `K`  - DKong -	Automatically places a quine in the stack. **This clears the stack**

**The order matters!**<br>
`BY` and `YB` work differently.<br>
`BY` receives input and turns into negative numbers, then places the quine.<br>
`YB` places the quine and then it is turned into negative numbers.

##Comments

Comments must be in a line on its own. They can start with any character except the characters.

Example:

    Mario can make tiny `cat` programs:
    M|O
    # isn't required to be the first character, and may be nowhere!

Only the first valid sequence of identifiers with a pipe will be ran:

    Mario can make more tiny `cat` programs:
    M|O
    Y|;|O <-- won't run!

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

 - `0-9` - Literal numbers
 - `a-zA-Z` - Literal characters
 - `""` - Double-quoted string (multiple stack values at once)
 - `'` - Single-quoted character

## Commands

### Arithmetic

It is possible to do math with Mario.

Examples:

    M|+c|O
    
Which outputs the sum of the first character and `c`.

List of arithmetic symbols:

 - `+` - Sums the values
 - `/` - Divides the values, returns an integer result
 - `\` - Divides the values, returns the reminder
 - `-` - Substracts the values
 - `*` - Multiplies the values
 - `^` - Multiplies the value in the register *n* times.
 - `«` - Adds *n* bits, with a maximum of 32 bits.
 - `»` - Removes *n* bits. If the register has less than *n* bits, it will be `0`
 - `~` - Flips all the bits in the register

### Stack operations

You can also manipulate the stack directly.

Allowed commands:

 - `>` - Takes the first element of the stack and place in the register `R`
 - `>n`- Takes *n*  elements of the stack and places them the register `R` as a string
 - `<` - Place the value in the registed into the stack, as the first element
 - `<v`- Place the literal value into the stack, as the first element
 - `!` - Reverses the stack
 - `?` - If the value is `0`, removes it from the stack
 - `:` - Purges the entire stack
 - `.` - Destroy the first value in the stack
 - `,` - Pushes all the input into the stack
 - `;` - Replaces the stack content with the input (equivalent to `:,`)

### Comparisons

Comparing values is hard.

But can be done!

Symbols:

 - `[` - Higher than
 - `]` - Lower than
 - `ç` - Equal
 - `Ç` - Not Equal
 - `(` - Positive `>0`
 - `)` - Negative `0<`

Example:

    M|>:<çC|O

Reads the first character into the register `R`, destroys the stack and pushes the result of comparing it with `C` into the stack, displaying it.

If a condition is verified, is produces `1`, otherwise `0`.

### Blocks and loops

There are a few loops one can do.

**For loop (`|#n`)**

The `for` loop loops a number until it reaches `0`, and will be stored in the register `I`.

Example:

    Y||#9<|N

Receives no output, disables negative numbers and output from  `9` to `0`.

**For loop (`|$n`)**

Exactly the same as above, but it goes towards *n* instead of towards `0` (as with `|#n`).

**Foreach (`|&`)**

Goes through every element in the stack, storing it in the register.

Example:

    Y||#F<|&*5|N

Outputs the result of multiplying all numbers from `0` to `10`.

**Blocks**

Code blocks are contained within `{}` and may return values

Example:

    M|>|${\3+5}<+1|O

Reads the input, takes the first character, and loops from 0 to `(Z % 3)+5` summing 1 in each iteration and pushing it into the stack.

**Conditional execution**

This works as an `if` on other languages.

You use `|%` and then you use 1 pipe or a block.

An `else` is `|@`.

Example:

    M||&{|%><+5|@{|%=5+1|@.}}|O

If the current value is 0, sums 5.<br>
If it is 5, then add 1, otherwise destroy the value.

Same code, in PHP (badly golfed):

    foreach($z=&$_POST as$k=>$v)if($v){if($v==5)$v++;else unset($z[$k]);}else$v=5;print_r($z);return$r;

## Variables

Variables are named registers.

To declare a variable, use a pipe and then a name, which can be the range `a-z`.

Use `=` to give it a value. If no value is specified, it will receive the value on the register `R`.

All the variables are global.

Example:

    M||&|z={+5}<|z|O

Receives the input, sums `5` to everything in the stack and outputs it.

Other registers:

 - `|R` - Explicit automatic register
 - `|I` - Explicit automatic register with the loop index
 - `|P` - Current 0-based index that is being read of the code (E.g.: `Y|<|P|M` would print `2`)
 - `|L` - Current stack length
 - `|Z` - Last returned value

## Tricks

You can do very quick ROT13 quines:

    K|1

You can process numbers as large as you wish:

    Y|<9^99|O

Or sum characters:

    M||&<+'~|O
