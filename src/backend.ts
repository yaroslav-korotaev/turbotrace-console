import util from 'node:util';
import chalk from 'chalk';
import { type SpanObject, type Backend } from './types';
import { indent, join, name, depth } from './utils';

export function createConsoleBackend(): Backend {
  let last: SpanObject | null = null;
  
  return {
    now() {
      return Date.now();
    },
    enter(span) {
      let s = name(span.name);
      
      if (span.parent && span.parent != last) {
        s = `${s} @ ${name(span.parent.name)}`;
      }
      
      s = chalk.gray(`${s} {`);
      
      s = indent(s, depth(span.depth));
      
      console.log(s);
      
      last = span;
    },
    exit(span, err) {
      let s = chalk.gray('}');
      
      if (span != last) {
        s = `${s} ${chalk.gray(`@ ${name(span.name)}`)}`;
      }
      
      s = indent(s, depth(span.depth));
      
      console.log(s);
      
      last = span.parent;
    },
    trace(origin, span, detailsOrMsg?: object | string, maybeMsg?: string) {
      const [msg, details] = (typeof detailsOrMsg == 'string')
        ? [detailsOrMsg, undefined]
        : [maybeMsg, detailsOrMsg]
      ;
      
      let m = msg && chalk.cyan(msg);
      let d = details && util.inspect(details, { depth: 20, colors: true });
      let s = join(m, d);
      
      if (!s) {
        return;
      }
      
      if (span != last) {
        s = `${s} ${chalk.gray(`@ ${name(span.name)}`)}`;
      }
      
      if (origin != span.origin) {
        s = `${s} ${chalk.gray(`from ${name(origin.name)}`)}`;
      }
      
      s = indent(s, depth(span.depth + 1));
      
      console.log(s);
      
      last = span;
    },
  };
}
