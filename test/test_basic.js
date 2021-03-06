var assert= assert || require('assert');
var gtpl= gtpl || require('../lib/gtpl');
var test_suite = test_suite || require('./test_suite.js');


e_test = this.e_test || test_suite.e_test;
e_throw = this.e_throw || test_suite.e_throw;
s_test = this.s_test || test_suite.s_test;
print_heading = this.print_heading || test_suite.print_heading;
run = this.run || test_suite.run;

print_heading('Testing: Basics');

//Real Basics
var templ,json,html;

templ = 'abc';
json = null;
html = 'abc';
e_test('string',templ,json,html);

templ = 'abc <div src="http://123.com?aerg&aerg=gr#"></div><br/>';
json = null;
html = 'abc <div src="http://123.com?aerg&aerg=gr#"></div><br/>';
e_test('htmlstring',templ,json,html);

templ = "\n \t \\d+ \'\'";
json = null;
html = "\n \t \\d+ \'\'";
e_test('backslash escaping',templ,json,html);

templ = '{_}';
json = 'abc';
html = 'abc';
e_test('jsonstring',templ,json,html);

templ = '{_}';
json = 'abc <>&';
html = 'abc &lt;&gt;&amp;';
e_test('jsonstring w/escaping',templ,json,html);
s_test('jsonstring w/escaping (post)', function() {
    assert.equal( json , 'abc <>&');
});

templ = '{_}';
json = 'abc <>&';
html = 'abc &lt;&gt;&amp;';
e_test('jsonstring w/escaping 2',templ,json,html,{escape_evals:true});
s_test('jsonstring w/escaping 2 (post)', function() {
    assert.equal( json , 'abc <>&');
});

templ = '{_}';
json = 'abc <>&';
html = 'abc <>& foobar';
e_test('jsonstring w/escaping 3',templ,json,html,{escape_evals:true,escape_eval_function: function(a){return a + ' foobar';}});
s_test('jsonstring w/escaping 3 (post)', function() {
    assert.equal( json , 'abc <>&');
});

templ = '{ _.a  }';
json = {a:'abc'};
html = 'abc';
e_test('basic _ eval',templ,json,html);

templ = '{ _ctx.a  }';
json = {a:'abc'};
html = 'abc';
e_test('basic _ctx eval',templ,json,html);

templ = '{ _.a.b  }';
json = {a:{b:'abc'}};
html = 'abc';
e_test('_ object notation',templ,json,html);

templ = ' { _.b  } ';
json = {a:'abc'};
html = ' undefined ';
e_test('_ undefined evaluation',templ,json,html);

templ = ' {_} ';
json = {a:'abc'};
html = ' [object Object] ';
e_test('object.toString evaluation',templ,json,html);

templ = ' {_} ';
json = [1,'a',null,[2,3,4]];
html = ' 1,a,,2,3,4 ';
e_test('Array.toString',templ,json,html);

templ = '{_.plus_2()}{_.plus_2()}{_.plus_2()}{_.plus_2()}';
json = {plus_2 : (function() { var start = 0; return function(){start +=2;start %= 8; return start;}; }())}; // modulo to pass process and run
html = '2460';
e_test('function invocation',templ,json,html);

templ = '{_.get({a:{b:1}})}{_.get({a:{b:2}},"{}}}{{}{")}{_.get({a:{b:3}},\'{}}}{{}{\')}{_.get({a:{b:4}},{})}';
json = {get : (function(o) { return o.a.b;})}; // modulo to pass process and run
html = '1234';
e_test('function invocation, nested brackets',templ,json,html);

templ = '{true}{false}{null}{undefined}{new Error()}{[1,2,3]}{">"}';
json = 'abc <>&';
html = 'truefalsenullundefinedError1,2,3&gt;';
e_test('Non-string escaping',templ,json,html,{escape_evals:true});

templ = '{_} {{_}}';
json = 'abc <>&';
html = 'abc &lt;&gt;&amp; abc <>&';
e_test('Double Bracket Eval',templ,json,html,{escape_evals:true,double_bracket_evals:true});

templ = '{{ _ctx.a  }}';
json = {a:'abc'};
html = 'abc';
e_test('basic _ctx eval (double bracket)',templ,json,html,{escape_evals:true,double_bracket_evals:true});

templ = '{{ _.a.b  }}';
json = {a:{b:'abc'}};
html = 'abc';
e_test('_ object notation (double bracket)',templ,json,html,{escape_evals:true,double_bracket_evals:true});

templ = ' {{ _.b  }} ';
json = {a:'abc'};
html = ' undefined ';
e_test('_ undefined evaluation (double bracket)',templ,json,html,{escape_evals:true,double_bracket_evals:true});

templ = ' {{_}} ';
json = {a:'abc'};
html = ' [object Object] ';
e_test('object.toString evaluation (double bracket)',templ,json,html,{escape_evals:true,double_bracket_evals:true});

templ = ' {{_}} ';
json = [1,'a',null,[2,3,4]];
html = ' 1,a,,2,3,4 ';
e_test('Array.toString (double bracket)',templ,json,html,{escape_evals:true,double_bracket_evals:true});

templ = '{{_.plus_2()}}{{_.plus_2()}}{{_.plus_2()}}{{_.plus_2()}}';
json = {plus_2 : (function() { var start = 0; return function(){start +=2;start %= 8; return start;}; }())}; // modulo to pass process and run
html = '2460';
e_test('function invocation (double bracket)',templ,json,html,{escape_evals:true,double_bracket_evals:true});

templ = '{{_.get({a:{b:1}})}}{{_.get({a:{b:2}},"{}}}{{}{")}}{{_.get({a:{b:3}},\'{}}}{{}{\')}}{{_.get({a:{b:4}},{})}}';
json = {get : (function(o) { return o.a.b;})}; // modulo to pass process and compile
html = '1234';
e_test('function invocation, nested brackets (double br)',templ,json,html,{escape_evals:true,double_bracket_evals:true});

templ = "{_.replace(/\\n/,', ').replace(/\\\\/,'X')}";
json = 'ab\nc\\';
html = "ab, cX";
e_test('eval with backslash escaping',templ,json,html);

templ = "{'ab\\\\c'.replace(/\\\\/,', ')}"; //four backslashes at ab\c because this is a string in string
json = null;
html = "ab, c";
e_test('eval with backslash escaping2',templ,json,html);


templ = 'a{*if true*}b';
json = null;
html = 'ab';
e_test('comment 1',templ,json,html);

templ = 'a{*if true {* \n  \t*}b';
json = null;
html = 'ab';
e_test('comment 2',templ,json,html);

templ = '{param P1=4}{_p.P1}';
json = null;
html = '4';
e_test('Basic Param',templ,json,html);

templ = '{param P1=4}{_p.P1}{param P1=_p.P1+7}{_p.P1}';
json = null;
html = '411';
e_test('Param Overwrite',templ,json,html);

templ = '{_ctx}';
json = 'abc';
html = 'abc';
e_test('Basic Global Context',templ,json,html);

templ = '{a}{_.a}{b.c}{_.b.c}';
json = {a:"xx",b:{c:"yy"}};
html = 'xxxxyyyy';
e_test('Provide Root Key',templ,json,html, {provide_root_keys:true});

templ = '{$}';
json = 'abc';
html = 'abc';
e_test('Root Designator',templ,json,html,{root_designator:'$'});

templ = '{param P1=4}{$p.P1}';
json = null;
html = '4';
e_test('Param Designator',templ,json,html,{param_designator:'$p'});

templ = '{param P1={a:1,"b":\'abc\',d:[1,2,{"my-bla":null}]}}';
json = null;
html = '';
e_test('Param Object Literal',templ,json,html);

templ = ' {\n \t  _ . a   \t\n} ';
json = {a:1};
html = ' 1 ';
e_test('Obscure format',templ,json,html);

templ = '{1,2}';
e_throw('Arguments Syntax check',templ,json,gtpl.TemplateParseError);

templ = '{{1}}';
e_throw('Strict syntax check',templ,json,gtpl.TemplateParseError);

templ = '{a.b;""}'; //Syntax Error + Reference error
e_throw('Strict syntax check 2',templ,json,gtpl.TemplateParseError);

templ = '{a:1,b:2}'; //Syntax Error + Reference error
e_throw('Strict syntax check 3',templ,json,gtpl.TemplateParseError);

templ = '{ _.a.b  }';
json = {a:null};
e_throw('TypeError',templ,json,gtpl.TemplateEvaluationError);

templ = '{ _.a.b  }';
json = null;
e_throw('TypeError 2',templ,json,gtpl.TemplateEvaluationError);

templ = ' { erha)} ';
e_throw('Syntax Error',templ,json,gtpl.TemplateParseError);


templ = ' { erha} ';
json = [1,'a',null,[2,3,4]];
html = ' 1,a,,2,3,4 ';
e_throw('Reference Error',templ,json,gtpl.TemplateEvaluationError);


templ = ' { erha ';
json = [1,'a',null,[2,3,4]];
html = ' 1,a,,2,3,4 ';
e_throw('Unbalanced { 1',templ,json,gtpl.TemplateParseError);

templ = ' { } }';
json = [1,'a',null,[2,3,4]];
html = ' 1,a,,2,3,4 ';
e_throw('Unbalanced } 2',templ,json,gtpl.TemplateParseError);

templ = ' {{ 1 }';
json = [1,'a',null,[2,3,4]];
html = ' 1,a,,2,3,4 ';
e_throw('Unbalanced } 3',templ,json,gtpl.TemplateParseError,{double_bracket_evals:true});


templ = ' {{ }} }}';
json = [1,'a',null,[2,3,4]];
html = ' 1,a,,2,3,4 ';
e_throw('Unbalanced } 4',templ,json,gtpl.TemplateParseError,{double_bracket_evals:true});

templ = 'a*}b';
json = null;
e_throw('Comment Error 1',templ,json,gtpl.TemplateParseError);

templ = 'a{* *} *}b';
json = null;
e_throw('Comment Error 2',templ,json,gtpl.TemplateParseError);

templ = 'a{* {**} *}b';
json = null;
e_throw('Comment Error 3',templ,json,gtpl.TemplateParseError);

templ = 'a{*b';
json = null;
e_throw('Comment Error 4',templ,json,gtpl.TemplateParseError);

templ = 'a{ *  *}b';
json = null;
e_throw('Comment Error 5',templ,json,gtpl.TemplateParseError);

templ = '{_.b}';
json = {a:1};
e_throw('Undefined Error 1',templ,json,gtpl.TemplateUnexpectedUndefinedError,{debug_evals:true, debug_undefined_evals:true});

templ = '{undefined}';
json = {a:1};
e_throw('Undefined Error 2',templ,json,gtpl.TemplateUnexpectedUndefinedError,{debug_evals:true, debug_undefined_evals:true});

templ = '{a}{_.a}{b.c}{_.b.c}';
json = {a:"xx",b:{c:"yy"}};
html = 'xxxxyyyy';
e_throw('Disabled Provide Root Keys',templ,json,gtpl.TemplateEvaluationError, {provide_root_keys:false});

s_test('Embedded Error 1',function() {
    templ = '{template t}AAA {undefined} BBB{/template}';
    json = {a:1};
    html = 'AAA TemplateUnexpectedUndefinedError: ';
    var result;
    assert.doesNotThrow(function(){result = run({T1:templ},'t',json,true,{debug_evals:true, debug_undefined_evals:true, embed_eval_errors:true});});
    assert.equal(result.substring(0,38), html, result);
    return result;
});

s_test('Embedded Error 2',function() {
    templ = '{template t}AAA {b} BBB{/template}';
    json = {a:1};
    html = 'AAA TemplateEvaluationError: ';
    var result;
    assert.doesNotThrow(function(){result = run({T1:templ},'t',json,true,{debug_evals:true, debug_undefined_evals:true, embed_eval_errors:true});});
    assert.equal(result.substring(0,29), html);
    return result;
});


s_test('Error Code Display 1', function() {
    templ = '{template t}line1\nline2\nline3\nline4\nline5\nline6\nerror in this line7{template}\nline8\nline9\nline10\nline11\nline12\nline13\nline14\n{/template}';
    json = null;
    var expected = "  2:\tline2\n  3:\tline3\n  4:\tline4\n  5:\tline5\n  6:\tline6\n> 7:\terror in this line7{template}\n  8:\tline8\n  9:\tline9\n  10:\tline10\n  11:\tline11\n  12:\tline12\n";
    var result;
    try {
        run({T1:templ}, 't', json, true);
    }
    catch(e) {
        result = e.code_to_string();
    }
    assert.equal(result, expected);
});

s_test('Error Code Display 2', function() {
    templ = '{template t}line1\nline2\nerror in this line3{template}\nline4\nline5\nline6{/template}';
    json = null;
    var expected = "  1:\t{template t}line1\n  2:\tline2\n> 3:\terror in this line3{template}\n  4:\tline4\n  5:\tline5\n  6:\tline6{/template}\n";
    var result;
    try {
        run({T1:templ}, 't', json, true);
    }
    catch(e) {
        result = e.code_to_string();
    }
    assert.equal(result, expected);
});

s_test('Error Code Display 3', function() {
    //Builder Error
    templ = '{template bla}\n{/if}\n';
    json = null;
    var expected = "  1:\t{template bla}\n> 2:\t{/if}\n";
    var result;
    try {
        run({T1:templ}, 't', json, true);
    }
    catch(e) {
        result = e.code_to_string();
    }
    assert.equal(result, expected);
});

s_test('Error Code Display 4', function() {
    //Eval Error
    templ = '{*line1\nline2\nline3\nline4\nline5\nline6\nline7*}\n{template t}line8\nline9{a.b}\nline10{/template}\n{*line11\nline12\nline13\nline14\nline15*}\n';
    json = null;
    var expected = "  4:\tline4\n  5:\tline5\n  6:\tline6\n  7:\tline7*}\n  8:\t{template t}line8\n> 9:\tline9{a.b}\n  10:\tline10{/template}\n  11:\t{*line11\n  12:\tline12\n  13:\tline13\n  14:\tline14\n";
    var result;
    try {
        run({T1:templ}, 't', json, true,{debug_evals:true,introspection_mode:'full'});
    }
    catch(e) {
        result = e.code_to_string();
    }
    assert.equal(result, expected);
});

