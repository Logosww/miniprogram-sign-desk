const urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

export const nanoid = (size = 21, customAlphabet?: string) => {
  let id = '';
  let i = size;
  let alphabet = customAlphabet ?? urlAlphabet;
  while (i--) {
    id += alphabet[(Math.random() * alphabet.length) | 0];
  }
  return id;
};


export const formatTime = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  );
};

export const formatNumber = (n: number) => {
  const s = n.toString();
  return s[1] ? s : '0' + s;
};
