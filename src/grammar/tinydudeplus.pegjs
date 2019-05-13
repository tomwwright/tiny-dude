{
  function withLocation(o) {
    return {
      ...o,
      location: location()
    }
  }
}

program	=
    statements:statement+
	
    { return withLocation({ node: "program", statements }) }

statement =
	_ block:block _ { return block; }
    / 
	_ statement:(assignment / declaration / out) _ ";" _ { return statement; }

out = 
  "out" _ expression:expression

    { return withLocation({ node: "out", expression }); }
    
block =
	block: ("if" / "loop") _ expression:expression _ "{" _ statements:statement* _ "}"
    
    { return withLocation({ node: block, expression, statements }); }  
    
declaration =
	type:type _ declaration:(assignment / identifier) _
	
    { return withLocation({ node: "declaration", type, declaration }); }
    
assignment =
	identifier:identifier _ "=" _ expression:expression
	
    { return withLocation({ node: "assignment", identifier, expression }); }
    
expression =
	"(" _ expression:expression _ ")"
    	{ return withLocation({ node: 'brackets', expression }); }
    /
    operator:unary_operator _ expression:expression
    	{ return withLocation({ node: "unary", operator, expression }); }
    /
    term:term _ rest:expression_rest?
        {
            if(rest) return withLocation({ node: "binary", operator: rest.operator, left: term, right: rest.expression });
            else return term;
        }

expression_rest = 
	operator:binary_operator expression:expression
    
    { return { operator, expression }; }
    
term =
	_ term:(identifier / boolean / number) _
	
    { return term; }

boolean =
	value:("true" / "false")
	
    { return withLocation({ node: "boolean", value }) }

    
type =
	"num" / "bool"
binary_operator = 
	"==" / "and" / "or" / ">=" / "<=" / "+" / "-" / "*" / "/" / "%"
unary_operator  =
	"not"
identifier =
	chars:([a-zA-Z][a-zA-Z0-9]*)
	
    { return withLocation({ type: "identifier", value: chars.join("") }) }

number =
	[0-9]+ 
	{ return withLocation({ type: "number", value: parseInt(text(), 10) }) }
    
_ "whitespace" =
	[ \t\n\r]*