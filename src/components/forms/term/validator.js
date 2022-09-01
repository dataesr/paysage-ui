export default function validation(body) {
  const ret = {
    ok: true,
    returnedErrors: [],
  };
  if (!body.usualNameFr) {
    ret.ok = false;
    ret.returnedErrors.push({
      field: 'usualNameFr',
      error: 'Le nom de la catégorie est obligatoire',
    });
  }

  return ret;
}
