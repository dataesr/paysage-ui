export default function validation(body) {
  const ret = {};
  if (!body?.account) {
    ret.account = 'Le compte/url du media social est obligatoire';
  }

  return ret;
}
