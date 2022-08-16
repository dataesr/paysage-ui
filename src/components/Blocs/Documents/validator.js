export default function validation(body) {
  const ret = {
    ok: true,
    returnedErrors: [],
  };

  if (!body.file) {
    ret.ok = false;
    ret.returnedErrors.push({
      field: 'file',
      error: 'Le fichier est obligatoire',
    });
  }

  return ret;
}
