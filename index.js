const fs = require('fs');
const { URL } = require('url');

// filter data options
const data1 = [];
const data2 = [];
const data3 = [];

function formatValue(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ /g, '_')
    .replace(/%/g, '');
}

function generateCombinations(arrays) {
  if (arrays.length === 0) return [[]];
  const first = arrays[0];
  const rest = generateCombinations(arrays.slice(1));
  return first.flatMap((value) => rest.map((combo) => [value, ...combo]));
}

function buildUrls(baseUrl, combinations) {
  return combinations.map((combo) => {
    const url = new URL(baseUrl);

    // url parameters
    if (combo[0]) url.searchParams.set('', formatValue(combo[0]));
    if (combo[1]) url.searchParams.set('', formatValue(combo[1]));
    if (combo[2]) url.searchParams.set('', formatValue(combo[2]));
    return url.toString();
  });
}

(async () => {

  // website base url
  const baseUrl = '';

  const combinations = generateCombinations([
    [null, ...data1],
    [null, ...data2],
    [null, ...data3],
  ]);

  const urls = buildUrls(baseUrl, combinations);

  const sitemapEntries = urls.map((url) => {
    return `<url><loc>${url}</loc><changefreq>weekly</changefreq></url>`;
  });

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>`;

  fs.writeFileSync('sitemap.xml', sitemapContent);

  console.log('Sitemap generated successfully.');
})();
