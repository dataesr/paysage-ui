export default function validation(body) {
  const ret = {
    ok: true,
    returnedErrors: [],
  };

  if (!body.country) {
    ret.ok = false;
    ret.returnedErrors.push({
      field: 'country',
      error: 'Le pays est obligatoire',
    });
  }

  return ret;
}
