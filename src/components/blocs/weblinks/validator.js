export default function validation(body) {
  const ret = {
    ok: true,
    returnedErrors: [],
  };

  if (!body.type) {
    ret.ok = false;
    ret.returnedErrors.push({
      field: 'type',
      error: 'Le type du lien est obligatoire',
    });
  }

  if (!body.url) {
    ret.ok = false;
    ret.returnedErrors.push({
      field: 'url',
      error: "L'URL du lien est obligatoire",
    });
  }

  return ret;
}
