import util from 'node:util';
import chalk from 'chalk';
import { type SpanObject, type Stream, type Backend } from './types';
import { indent, join, errorMessage, name, depth } from './utils';

export function createBackend(stream: Stream): Backend {
  let last: SpanObject | null = null;
  let timestamp = Date.now();
  
  const write = (s: string) => {
    const now = Date.now();
    const elapsed = now - timestamp;
    const e = chalk.gray(`+${elapsed}ms`);
    
    stream.write(`${s} ${e}\n`);
    timestamp = now;
  };
  
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
      
      write(s);
      
      last = span;
    },
    exit(span, err) {
      let s = chalk.gray(`} =${span.stop - span.start}ms`);
      
      if (span != last) {
        s = `${s} ${chalk.gray(`@ ${name(span.name)}`)}`;
      }
      
      if (err) {
        s = `${s} ${chalk.red('error')} ${chalk.grey(errorMessage(err))}`;
      }
      
      s = indent(s, depth(span.depth));
      
      write(s);
      
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
        s = `${s} ${chalk.gray(`from ${name(origin.tag)}`)}`;
      }
      
      s = indent(s, depth(span.depth + 1));
      
      write(s);
      
      last = span;
    },
  };
}
