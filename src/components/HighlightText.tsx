import type { HighlightSpan } from '../types';

interface HighlightTextProps {
  text: string;
  highlights?: HighlightSpan[];
}

export function HighlightText({ text, highlights = [] }: HighlightTextProps) {
  if (!highlights.length) {
    return <p className="whitespace-pre-wrap leading-relaxed text-slate-200">{text}</p>;
  }

  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  const output: Array<{ key: string; value: string; className?: string }> = [];
  let index = 0;

  for (const span of sorted) {
    if (span.start > index) {
      output.push({
        key: `${index}-${span.start}`,
        value: text.slice(index, span.start),
      });
    }

    const className =
      span.type === 'addition'
        ? 'highlight-add rounded'
        : span.type === 'removal'
          ? 'highlight-remove rounded'
          : 'underline decoration-emerald-400 decoration-2 underline-offset-4';

    output.push({
      key: span.id,
      value: text.slice(span.start, span.end),
      className,
    });

    index = span.end;
  }

  if (index < text.length) {
    output.push({
      key: `${index}-end`,
      value: text.slice(index),
    });
  }

  return (
    <p className="whitespace-pre-wrap leading-relaxed text-slate-200">
      {output.map((segment) => (
        <span key={segment.key} className={segment.className}>
          {segment.value}
        </span>
      ))}
    </p>
  );
}
