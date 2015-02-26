// Regular expression /(?:^|[\r\n])([MLPBTYK]+)\|(?:(.*)\|)?([OQ|\-1RNM])(?:$|[\r\n])/

( function( window, undefined ){
	
	window.MarioGolf = function( code ){
		var tmp = [];
		if( !code || !( code = code.match( /(?:^|[\r\n])([MLPBTYK]+)\|(?:(.*)\|)?([OQ|\-1RNM])(?:$|[\r\n])/ ) ) )
		{
			throw new SyntaxError( 'Expecting identifier, got ' + (code? 'invalid program' : '0-length code' ) + '.', 'code', 0 );
		}
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
		
		runBlock = function( block ){
			
		};
		
		return {
			run: function( input ){
				memory = {
					code:memory.code,
					return:'',
					input:input,
					stack:[],
					registers:{R:0,I:0,P:0,L:0,Z:0},
					vars:{},
					output:''
				};
				
				return memory.return = runBlock( memory.code );
			},
			getStack: function(){ return memory.stack; },
			getReturn: function(){ return memory.return; },
			getVars: function(){ return memory.vars; },
			getOutput: function(){ return memory.output; }
		};
		
	};
	
} )( []['slice']['constructor']( 'return this;' )() );
