export default function validation(body) {
  const ret = {};
  if (!body?.type) {
    ret.type = 'Le type est obligatoire';
  }

  if (!body?.url) {
    ret.url = "L'URL est obligatoire";
  }

  return ret;
}
