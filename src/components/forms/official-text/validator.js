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

  if (!body.publicationDate) {
    ret.ok = false;
    ret.returnedErrors.push({
      field: 'publicationDate',
      error: 'La date de publication du texte officiel est obligatoire',
    });
  }

  // TODO
  // Si boesr alors NOR et BOESRID required
  // Si JO alors Jorftext required et URL automatiquement remplie

  return ret;
}
