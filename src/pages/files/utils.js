export const urltoFile = async (url, filename, mimeType) =>{
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return new File([buf], filename, { type: mimeType });
}