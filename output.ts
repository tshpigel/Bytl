import * as TYPE from './defs/types.ts';
let i: TYPE.Int = TYPE.IntConstruct({ __type: 'Number', value: 5 });
let s: TYPE.Sc = { __type: 'String', value: "a string" };
let d: TYPE.Dec = TYPE.DecConstruct({ __type: 'Number', value: 3 });
let c: TYPE.Char = TYPE.CharConstruct({ __type: 'String', value: 'd' });
let b: TYPE.Bool = { __type: 'Boolean', value: false };
let n: TYPE.Nil = { __type: 'Nil', value: "Nil" };
console.log(i.value,s.value,d.value,c.value,b.value,n.value);
