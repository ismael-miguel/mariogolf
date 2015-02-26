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
					input:'',
					stack:[],
					registers:{R:0,I:0,P:0,L:0,Z:0},
					vars:{},
					output:''
				};
				
				var negative = true;
				
				for(var i = 0, l = memory.code[1], c; i<l; i++)
				{
					switch(c = memory.code[1].charCodeAt(i))
					{
						case 'M':
							memory.input = (input || '');break;
						case 'L':
							memory.input = input ? (input + '').reverse() : '';break;
						case 'P':
							negative = false;break;
						case 'B':
							memory.input = [];
							if( input )
							{
								for(var j = 0, k = input.length; j<k; j++)
								{
									memory.input[j] = -input.charCodeAt(j);
								}
							}
							break;
						case 'T':
							console.log('This feature isn\'t implemented');
							throw new NotImplemented('identifier T (Toad)');
							break;
						case 'Y':break; //empty stack
						case 'K':
							memory.input = memory.code.split('');break;
						default:
							throw new ReferenceError('Unknown identifier "'+c+'"');
					}
				}
				
				if( memory.code[3].indexOf('Q') == -1 )
				{
					memory.return = runBlock( memory.code );
				}
				
				for(var i = 0, l = memory.code[3], c; i<l; i++)
				{
					switch(c = memory.code[3].charCodeAt(i))
					{
						case '-':
							memory.return = undefined;
						case 'O':
							console.log( memory.output = memory.stack.join('') );break;
						case 'Q':
							console.log( memory.output = memory.code );break;
						case '|':
							memory.return = memory.stack;break;
						case '1':
							console.log( memory.output = rot13( memory.stack.join('') ) );break;
						case 'R':
							console.log( memory.output = memory.stack.join('').reverse() );break;
						case 'N':
							console.log( memory.output = memory.stack.join('').split('').join('\r\n') );
							memory.return = memory.output.split('\r\n');break;
						case 'M':
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
