
const playButton = document.querySelector('button');

playButton.addEventListener('click', function () {
   generateCode()
});

function generateCode() {
  var sygusSolution = document.getElementById('sygus').value;
  var extractDef = new RegExp(/\(.*?\)\) [^ ]* /);
  var fxnDef = sygusSolution.replace(extractDef, "").slice(0, -1);
  var fxnName = sygusSolution.split(" ")[1];
  var generatedCode = generator(smt_parser(fxnDef), fxnName);
  console.log(generatedCode);
}

function generator(ast, fxnName) {
  if (typeof ast === 'number') {
    return ast.toString();
  } else if (typeof ast === 'string') {
    return ast;
  } else if (ast.length === 1) {
    if (typeof ast[0] === 'string') {
      return ast[0];
    }
    return generator(ast[0], fxnName);
  } else if (ast[0] === '=') {
    return generator(ast[1], fxnName) + ' === ' + generator(ast[2], fxnName);
  } else if (ast[0] === '<=') {
    return generator(ast[1], fxnName) + ' <= ' + generator(ast[2], fxnName);
  } else if (ast[0] === '>=') {
    return generator(ast[1], fxnName) + ' >= ' + generator(ast[2], fxnName);
  } else if (ast[0] === '+') {
    return '(' + generator(ast[1], fxnName) + ' + ' + generator(ast[2], fxnName) + ')';
  } else if (ast[0] === '-') {
    return '(' + generator(ast[1], fxnName) + ' - ' + generator(ast[2], fxnName) + ')';
  } else if (ast[0] === 'ite') {
    return '(' + generator(ast[1], fxnName) + ' ? ' + generator(ast[2], fxnName) + ' : ' + generator(ast[3], fxnName) + ')';
  } else if (ast[0] === 'not') {
    return '!(' + generator(ast[1], fxnName) + ')';
  } else if (ast[0] === 'and') {
    return '(' + generator(ast[1], fxnName) + ' && ' + generator(ast[2], fxnName) + ')';
  } else if (ast[0] === 'or') {
    return '(' + generator(ast[1], fxnName) + ' || ' + generator(ast[2], fxnName) + ')';
  } 
}



