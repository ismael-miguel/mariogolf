// Regular expression /(?:^|[\r\n])([MLPBTYK]+)\|(?:(.*)\|)?([OQ|\-1RNM])(?:$|[\r\n])/

( function( window, undefined ){
	
	window.MarioGolf = function( code ){
		var tmp = [];
		if( !code || !code.match( /(?:^|[\r\n])([MLPBTYK]+)\|(?:(.*)\|)?([OQ|\-1RNM])(?:$|[\r\n])/ ) )
		{
			throw new SyntaxError( 'Expecting identifier, got ' + (code? 'invalid program' : '0-length code' ) + '.', 'code', 0 );
		}
		else if( ( tmp[0] = code[1].matches( /\{(?=([^"]*"[^"]*")*[^"]*$)/g ) ) != ( tmp[1] = code[1].matches( /\}(?=([^"]*"[^"]*")*[^"]*$)/g ) ) )
		{
			throw new SyntaxError( 'Missing "' + ( tmp[0] < tmp[1] ? '{' : '}' ) + '" before the last identifier.', 'code', 0 );
		}
		
		var memory = {
			code:code,
			return:'',
			input:'',
			stack:[],
			registers:{R:0,I:0,P:0,L:0,Z:0}
			vars:{},
			output:''
		},
		
		runBlock = function( block ){
			
		};
		
		return {
			run: function(run){
				
			},
			getStack: function(){ return memory.stack; },
			getReturn: function(){ return memory.return; },
			getVars: function(){ return memory.vars; },
			getOutput: function(){ return memory.output; }
		}
		
	};
	
} )( []['slice']['constructor']( 'return this;' )() );
