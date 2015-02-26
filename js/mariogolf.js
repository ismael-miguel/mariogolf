// Regular expression /(?:^|[\r\n])([MLPBTYK]+)\|(?:(.*)\|)?([OQ|\-1RNM])(?:$|[\r\n])/

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
		
		NotImplemented = function(feature){
			this.name = 'NotImplemented';
			this.message = 'The feature "' + feature + '" wasn\'t implemented';
		},
		
		runBlock = function( block ){
			
		};
		
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
							memory.stack = memory.code.split('');break;
						default:
							throw new ReferenceError('Unknown identifier "'+c+'"');
					}
				}
				
				memory.registers.L = memory.stack.length;
				
				if( memory.code[3].indexOf('Q') == -1 && memory.code[2] )
				{
					console.log('This feature isn\'t implemented');
					throw new NotImplemented('identifier T (Toad)');
					memory.return = runBlock( memory.code );
				}
				
				for(var i = 0, l = memory.code[3].length, c; i<l; i++)
				{
					switch(c = memory.code[3].charAt(i))
					{
						case '-': //destroy the return
							memory.return = undefined;
						case 'O': //display the content
							console.log( memory.output = memory.stack.join('') );break;
						case 'Q': //quine
							console.log( memory.output = memory.code );break;
						case '|': //doesn't display anything, returns the stack
							memory.return = memory.stack;break;
						case '1': //displays the content as rot13
							console.log( memory.output = rot13( memory.stack.join('') ) );break;
						case 'R': //displays reversed
							console.log( memory.output = memory.stack.join('').split('').reverse().join('') );break;
						case 'N': //outputs line by line, returns array
							console.log( memory.output = memory.stack.join('').split('').join('\r\n') );
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
							console.log( memory.output = memory.return.join('\r\n') );break;
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
			getMemory: function(){ return memory; }
		};
		
	};
	
} )( []['slice']['constructor']( 'return this;' )() );
