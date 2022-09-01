export default function validation(body) {
  const ret = {
    ok: true,
    returnedErrors: [],
  };
  if (!body.lastName) {
    ret.ok = false;
    ret.returnedErrors.push({
      field: 'lastName',
      error: 'Le nom de la personne est obligatoire',
    });
  }

  return ret;
}
