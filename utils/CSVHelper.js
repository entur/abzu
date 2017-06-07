export const jsonArrayToCSV = (jsonArray, headerOptions, delimiter = ';', transformer) => {
  const replacer = (key, value) => value || '';
  const header = headerOptions.filter(ho => ho.checked);
  let csv = jsonArray.map(row =>
    header
      .map(fieldName =>
        JSON.stringify(transformer[fieldName.id](row), replacer),
      )
      .join(delimiter),
  );
  csv.unshift(header.map(h => h.id).join(delimiter));
  csv = csv.join('\r\n');

  return csv;
};
