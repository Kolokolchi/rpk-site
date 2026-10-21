const headingBreaks: Record<string, number> = {
  металлоконструкции: 7,
  информационные: 7,
  проектирование: 7,
  подрядчиков: 6,
  брендирование: 6,
};

export function readableHeading(text: string) {
  return text.split(/(\p{L}+)/u).map((word, index) => {
    const position = headingBreaks[word.toLocaleLowerCase("ru")];
    if (position === undefined) return word;

    // Keep the word whole whenever it fits; the soft hyphen is only a fallback.
    return (
      <span className="heading-word" key={index}>
        {`${word.slice(0, position)}\u00ad${word.slice(position)}`}
      </span>
    );
  });
}
