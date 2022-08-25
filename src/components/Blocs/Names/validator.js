export default function validation(body) {
  const ret = {
    ok: true,
    returnedErrors: [],
  };

  if (!body.usualName) {
    ret.ok = false;
    ret.returnedErrors.push({
      field: 'usualName',
      error: 'Le nom usuel est obligatoire',
    });
  }

  return ret;
}
