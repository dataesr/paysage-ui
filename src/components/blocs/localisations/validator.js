export default function validation(body) {
  const ret = {};

  if (!body?.country) {
    ret.country = 'Le pays est obligatoire';
  }

  return ret;
}
