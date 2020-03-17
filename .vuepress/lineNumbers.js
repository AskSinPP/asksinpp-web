module.exports = md => {
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = (...args) => {
    const rawCode = fence(...args);
    const code = rawCode.slice(
      rawCode.indexOf('<code>'),
      rawCode.indexOf('</code>')
    );

    const lines = code.split('\n');
    const lineNumbersCode = [...Array(lines.length - 1)]
      .map((line, index) => `<a class="line-number" id="l${ index + 1 }" href="#l${ index + 1 }">${ index + 1 }</a><br>`).join('');

    const lineNumbersWrapperCode
      = `<div class="line-numbers-wrapper">${ lineNumbersCode }</div>`;

    return rawCode
      .replace('<!--beforeend-->', `${ lineNumbersWrapperCode }<!--beforeend-->`)
      .replace('extra-class', 'line-numbers-mode')
  }
};
