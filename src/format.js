function monospaceFormat(text) {
  return `\`\`\`\n${text}\`\`\``;
}

function paddingText(text, opts = {}) {
  const { align = '', size, add = '' } = opts;
  text = typeof text === 'number' ? text.toString() : text;
  const lengthText = typeof text == 'number' ? text.toString().length : text.length;
  let message;
  if (size) {
    if (lengthText + add.length > size) {
      message = text.substring(0, size - 2 - add.length) + '..' + add;
    } else {
      if (align.toLowerCase() === 'right') {
        message = new Array(size - lengthText - add.length).fill(' ').join('') + text + add;
      } else {
        message = text + add + new Array(size - lengthText - add.length).fill(' ').join('');
      }
    }
  }
  return message;
}

module.exports = {
  monospaceFormat,
  paddingText
}
