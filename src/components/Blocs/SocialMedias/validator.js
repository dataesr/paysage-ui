export default function validation(body) {
  const ret = {
    ok: true,
    returnedErrors: [],
  };

  if (!body.type) {
    ret.ok = false;
    ret.returnedErrors.push({
      field: 'type',
      error: 'Le type de média social est obligatoire',
    });
  }

  if (!body.account) {
    ret.ok = false;
    ret.returnedErrors.push({
      field: 'account',
      error: 'Le compte/url du media social est obligatoire',
    });
  }

  return ret;
}
