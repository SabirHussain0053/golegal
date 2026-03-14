// Placeholder logo – the original asset is not in this repo.
// next/image needs a StaticImport or a URL string; export a data-URI so the
// build does not break.
const LOGO_SVG = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40"><text x="10" y="30" font-size="28" font-weight="bold" font-family="sans-serif">GoLegal</text></svg>'
)}`;

export const Golegal = {
  src: LOGO_SVG,
  height: 40,
  width: 200,
};
