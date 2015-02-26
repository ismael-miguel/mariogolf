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
				
				for(var i = 0, l = memory.code[0], c; i<l; i++)
				{
					switch(c = memory.code[0].charCodeAt(i))
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
						default:
							throw new ReferenceError('Unknown identifier "'+c+'"');
					}
				}
				
				return memory.return = runBlock( memory.code );
			},
			getStack: function(){ return memory.stack; },
			getReturn: function(){ return memory.return; },
			getVars: function(){ return memory.vars; },
			getOutput: function(){ return memory.output; }
		};
		
	};
	
} )( []['slice']['constructor']( 'return this;' )() );
