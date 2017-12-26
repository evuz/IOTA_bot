export function paddingText(text, opts: Options = {}) {
  const { align = '', size, add = '' } = opts;
  text = typeof text === 'number' ? text.toString() : text;
  const lengthText = text.length;
  let message;
  if (size) {
    if (lengthText + add.length > size) {
      message = text.substring(0, size - add.length) + add;
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

interface Options {
  align?: string;
  size?: number;
  add?: string;
}
