//  To ensure presevation of presendence, sometimes we need to add parens
//  TODO would be nice to actually track presendence of operations
//  is there some kind of library for this?

function astToJsStructureP(ast){
  if (ast.length > 1) {
    return "(" + astToJsStructure(ast) + ")"
  }
  else {
    return astToJsStructure(ast);
  }
}



//  is the best way to do this just hard coding rules for each operation?
//  given that js is such a mess, might be...
function astToJsStructure(ast){
  // terminal symbol
  if( typeof ast == "string" || typeof ast == "number") {
    return ast;
  }
  else if (ast.length == 1) {
    return ast[0];
  }
  else if (ast[0] == "str.at") {
    return astToJsStructureP(ast[1]) + "[" + astToJsStructure(ast[2]) + "]";
  }
  else if (ast[0] == "str.++" || ast[0] == "+") {
    return astToJsStructureP(ast[1]) + " + " + astToJsStructureP(ast[2]);
  }
  else if (ast[0] == "str.substr") {
    return astToJsStructureP(ast[1]) +
           ".substring(" + astToJsStructure(ast[2]) + " , " + astToJsStructure(ast[3]) + "+1)";
  }
  else if (ast[0] == "str.len") {
    return astToJsStructureP(ast[1]) +
           ".length";
  }
  else if (ast[0] == "mod") {
    return astToJsStructureP(ast[1]) +
           " % " +
           astToJsStructureP(ast[2]);
  }
  else if (ast[0] == "-") {
    return astToJsStructure(ast[1]) + " - " + astToJsStructureP(ast[2]);
  }
  else if (ast[0] == "*") {
      return astToJsStructureP(ast[1]) + " * " + astToJsStructureP(ast[2]);
  }
  else if (ast[0] == "str.replace") {
    return astToJsStructureP(ast[1]) +
           ".replace(" +
           astToJsStructure(ast[2]) +
           ", " +
           astToJsStructure(ast[3]) +
           ")";
  }
  else if (ast[0] == "str.prefixof") {
    return astToJsStructureP(ast[2]) +
           ".includes(" +  astToJsStructure(ast[1]) + ")" + " && " + astToJsStructureP(ast[1]) +
                  ".includes(" + astToJsStructure(ast[2]) + "[0])";
  }
  else if (ast[0] == "str.suffixof") {
    return astToJsStructureP(ast[2]) +
           ".includes(" +  astToJsStructure(ast[1]) + ")" + " && " + astToJsStructureP(ast[1]) +
                  ".includes(" + astToJsStructure(ast[2]) + "["+ astToJsStructureP(ast[2]) + ".length-1])";
  }
  else if (ast[0] == "str.indexof") {
    return astToJsStructureP(ast[1]) +
           ".indexOf(" +  astToJsStructure(ast[2]) + "," + astToJsStructure(ast[3]) + ")";
  }
  else {
    console.error("Unhandled AST form: "+ast+" : "+(typeof ast));
  }
};

astToJs = function(ast) {
  return "  return " + astToJsStructure(ast) + ";";
};




function astToJs(node) {
  switch (node[0]) {
    case 'max2': // max2 the function name
      return `function max2(x, y) {
        return ${astToJs(node[1])} > ${astToJs(node[2])} ? ${astToJs(node[1])} : ${astToJs(node[2])};
      }`;
    case 'ite': // for ifthenelse
      return `(${astToJs(node[1])}) ? (${astToJs(node[2])}) : (${astToJs(node[3])})`;
    case '+': 
    case '-': 
    case '*': 
    case '/': 
      return `(${astToJs(node[1])}) ${node[0]} (${astToJs(node[2])})`;
    case '<=': 
    case '>=': 
    case '<': 
    case '>': 
    case '=': 
      return `(${astToJs(node[1])}) ${node[0]} (${astToJs(node[2])})`;
    default:
      throw new Error(`Unknown node type: ${node[0]}`);
  }
}
