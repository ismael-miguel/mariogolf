( function( window, undefined ){
	
	window.MarioGolf = function( code ){
		var tmp = [];
		if( !code || !( code = code.match( /(?:^|[\r\n])([MLPBTYK]+)\|(?:(.*)\|)?([OQ|\-1RNM])(?:$|[\r\n])/ ) ) )
		{
			throw new SyntaxError( 'Expecting identifier, got ' + (code? 'invalid program' : '0-length code' ) + '.', 'code', 0 );
		}
		/*All credits due to @Jens (http://stackoverflow.com/users/276070/jens) for the trick:
		 *\+(?=([^"]*"[^"]*")*[^"]*$) - matches any + not inside quotes
		 *Question: http://stackoverflow.com/questions/6462578/alternative-to-regex-match-all-instances-not-inside-quotes
		 */
		else if( code[2] != undefined && ( tmp[0] = code[2].match( /\{(?=([^"]*"[^"]*")*[^"]*$)/g ) || [] ).length != ( tmp[1] = code[2].match( /\}(?=([^"]*"[^"]*")*[^"]*$)/g ) || [] ).length )
		{
			throw new SyntaxError( 'Missing "' + ( tmp[0] < tmp[1] ? '{' : '}' ) + '" before the last identifier.', 'code', 0 );
		}
		
		var memory = {
			code:code,
			return:'',
			input:'',
			stack:[],
			registers:{R:0,I:0,P:0,L:0,Z:0},
			vars:{},
			output:''
		},
		
		/*All credits due to @BenAlpert (http://stackoverflow.com/users/49485/ben-alpert) for this implementation
		 *Original code: s.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
		 *Also, the use @ledlogic (http://stackoverflow.com/users/987044/ledlogic) made a general rot# function:
		 *function rot(s,i){return s.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+i)?c:c-26);});}
		 *The latest is available on http://jsfiddle.net/ledlogic/tC7qe/
		 */
		rot13 = function(s){return s.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});},
		
		/*All credits due to @Jeff (http://stackoverflow.com/users/353278) for this function
		 *Original source: http://snippets.dzone.com/posts/show/849
		 *http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
		 */
		shuffle = function(o){
			for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
		},
		
		//tries to parse or get a value from a piece of code
		fetchValue = function( code ){
			var current = code[0], currentChar = current.charAt(0), nextChar = current.charAt(1);
			switch( currentChar )
			{
				case '\'':
					return nextChar;
					
				case '"':
					return current.substr(1,current.length-2);
					break;
					
				case '|':
					if( /[a-zRIPLZ]/.test( nextChar ) && (memory.vars[nextChar] || nextChar in memory.registers) )
					{
						if( /^[a-z]$/.test( nextChar ) )
						{
							return memory.vars[nextChar];
						}
						else
						{
							return memory.registers[nextChar];
						}
					}
					else
					{
						throw new ReferenceError( 'Undefined register "'+nextChar+'"', 'code', 0 );
					}
					break;
					
				case '{':
					return runBlock( code );
					
				default:
					
					if( /[a-z\d]/.test(currentChar) )
					{
						return code.match( /(^[a-z\d]+)/ )[1] || 0;
					}
					else
					{
						return '';
					}
			}
			
		},
		
		runBlock = function( block ){
			for( var i = 0, l = block.length, c, Return; i<l; i++)
			{
				memory.registers.P++;
				switch(c = block[i])
				{
				
					/*******Arithmetic*******/
					
					case '+':
						Return = (memory.registers.R / 1 || 0 ) + fetchValue( block.slice( i + 1 ) );
						break;
					case '/':
						Return = ( (memory.registers.R / 1 || 0 ) / fetchValue( block.slice( i + 1 ) ) ) >> 0;
						break;
					case '\\':
						Return = ( memory.registers.R / 1 || 0 ) % fetchValue( block.slice( i + 1 ) );
						break;
					case '-':
						Return = memory.registers.R - fetchValue( block.slice( i + 1 ) );
						break;
					case '^':
						Return = Math.pow( memory.registers.R, fetchValue( block.slice( i + 1 ) ) );
						break;
					case '«':
						Return = ( memory.registers.R / 1 || 0 ) << ( fetchValue( block.slice( i + 1 ) ) & 32 );
						break;
					case '»':
						Return = ( memory.registers.R / 1 || 0 ) >> ( fetchValue( block.slice( i + 1 ) ) & 32 );
						break;
					case '~':
						Return = ~ ( memory.registers.R / 1 || 0 );
						break;
				
					/*******   Stack   *******/
					case ':':
						memory.stack = [];
						memory.registers.L = memory.registers.R = 0;
						break;
					case '.':
						memory.stack.shift();
						memory.registers.L = memory.stack.length;
						memory.registers.R = memory.stack[0] || 0;
						break;
					case ',':
						memory.registers.L = memory.stack.push.apply(memory.stack,memory.input.split(''));
						break;
					case ';':
						memory.stack = memory.input.split('');
						memory.registers.L = memory.input.length;
						break;
					case '!':
						memory.stack = memory.stack.reverse();
						memory.registers.R = memory.stack[0] || 0;
						break;
					case '?':
						if( memory.stack.length && (!memory.stack[0] || memory.stack[0]=='0') )
						{
							memory.stack.shift();
							memory.registers.R = memory.stack[0] || 0;
						}
						break;
					case '<':
						var tmp = fetchValue( block[i + 1] );
						if( tmp / 1 == tmp / 1)
						{
							Return = memory.stack[memory.stack.length] = tmp >> 0;
						}
						else
						{
							Return = tmp;
							for(var j = 0, l = tmp.length; j<l; j++ )
							{
								memory.stack[memory.stack.length] = tmp.charAt(j);
							}
						}
						memory.registers.R = memory.stack[0];
						memory.registers.L = memory.stack.length;
						break;
				}
			}
		},
		
		outputHandler = window.console.log;
		
		return {
			run: function( input ){
				memory = {
					code:memory.code,
					return:'',
					input:input,
					stack:[],
					registers:{R:0,I:memory.code.index,P:0,L:0,Z:0},
					vars:{},
					output:''
				};
				
				var negative = true;
				
				for(var i = 0, l = memory.code[1].length, c; i<l; i++)
				{
					switch(c = memory.code[1].charAt(i))
					{
						case 'M': //loads all the characters to the stack
							memory.stack = (input || '').split('');break;
						case 'L': //same as M, but reverses
							memory.stack = input ? (input + '').reverse().split('') : [];break;
						case 'P': //disables negatives
							negative = false;break;
						case 'B': //EVERYTHING is a negative number
							memory.stack = [];
							if( input )
							{
								for(var j = 0, k = input.length; j<k; j++)
								{
									memory.stack[j] = -input.charAt(j);
								}
							}
							break;
						case 'T': //shuffles the stack
							memory.stack = shuffle( memory.stack );break;
						case 'Y':break; //empty stack
						case 'K': //places a quine into the stack
							memory.stack = memory.code[0].replace(/^\s+/,'').split('');break;
						default:
							throw new ReferenceError('Unknown identifier "'+c+'"');
					}
				}
				
				memory.registers.L = memory.stack.length;
				memory.registers.R = memory.stack[0] || 0;
				memory.registers.P = code[1].length + 1 ;
				
				if( memory.code[3].indexOf('Q') == -1 && memory.code[2] )
				{
					memory.return = runBlock( memory.code[2].match(/\|[a-zRIPLZ#$&%@]|'.|"(?:\\"|[^"])*"|[={}\\\/+\-*^«»~><!?:.,;\[\]çÇ\(\)]|\d+|(?:[^={}\\\/+\-*\^«»~><!?:.,;\[\]çÇ\(\)']|\|[^a-zRIPLZ#$&%@])+/g) );
				}
				
				if( 0 in memory.stack )
				{
					memory.stack[0] = memory.registers.R;
				}
				
				for(var i = 0, l = memory.code[3].length, c; i<l; i++)
				{
					switch(c = memory.code[3].charAt(i))
					{
						case '-': //destroy the return
							memory.return = undefined;
						case 'O': //display the content
							outputHandler.call( window.console, [memory.output = memory.stack.join('')] );break;
						case 'Q': //quine
							outputHandler.call( window.console, [memory.output = memory.code[0].replace(/^\s+/,'')] );break;
						case '|': //doesn't display anything, returns the stack
							memory.return = memory.stack;break;
						case '1': //displays the content as rot13
							outputHandler.call( window.console, [memory.output = rot13( memory.stack.join('') )] );break;
						case 'R': //displays reversed
							outputHandler.call( window.console, [memory.output = memory.stack.join('').split('').reverse().join('')] );break;
						case 'N': //outputs line by line, returns array
							outputHandler.call( window.console, [memory.output = memory.stack.join('').split('').join('\r\n')] );
							memory.return = memory.output.split('\r\n');break;
						case 'M': //outputs numbers line-by-line, returns array
							memory.return = [];
							if( memory.stack.length )
							{
								for(var j = 0, k = memory.stack.length; j<k; j++)
								{
									memory.return[j] = 'string' == typeof memory.stack[j] ? memory.stack[j] : String.fromCharCode(memory.stack[j]);
								}
							}
							outputHandler.call( window.console, [memory.output = memory.return.join('\r\n')] );break;
						default:
							throw new ReferenceError('Unknown identifier "'+c+'"');
					}
				}
				
				return memory.return;
			},
			getStack: function(){ return memory.stack; },
			getReturn: function(){ return memory.return; },
			getVars: function(){ return memory.vars; },
			getOutput: function(){ return memory.output; },
			getMemory: function(){ return memory; },
			setOutputHandler: function( fn ){
				if( fn instanceof window.Function)
				{
					outputHandler = fn;
					return true;
				}
				else
				{
					return false;
				}
			}
		};
		
	};
	
	window.MarioGolf.getVersion = function(){
		return {
			major: 0,
			minor: 3,
			revision: 3,
			branch: 'a',
			valueOf: function(){
				return this.major + '.' + this.minor + '.' + this.revision + '-' + this.branch;
			},
			toString: function(){
				return this.valueOf();
			}
		};
	};
	
} )( Function('return this')() );
