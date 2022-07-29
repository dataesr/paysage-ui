export default function validation(body) {
  const ret = {
    ok: true,
    returnedErrors: [],
  };
  if (!body.nature) {
    ret.ok = false;
    ret.returnedErrors.push({
      field: 'nature',
      error: 'La nature du texte officiel est obligatoire',
    });
  }

  if (!body.type) {
    ret.ok = false;
    ret.returnedErrors.push({
      field: 'type',
      error: 'Le type du texte officiel est obligatoire',
    });
  }

  if (!body.title) {
    ret.ok = false;
    ret.returnedErrors.push({
      field: 'title',
      error: 'Le titre du texte officiel est obligatoire',
    });
  }

  if (!body.pageUrl) {
    ret.ok = false;
    ret.returnedErrors.push({
      field: 'pageUrl',
      error: "L'URL de destination du texte officiel est obligatoire",
    });
  }

  return ret;
}
