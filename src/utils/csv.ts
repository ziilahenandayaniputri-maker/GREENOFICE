export const downloadCsv = (filename: string, rows: Array<Array<string | number>>): void => {
  const contents = rows
    .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
  const blob = new Blob(['\uFEFF', contents], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
