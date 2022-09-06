export default function validation(body) {
  const ret = {
    ok: true,
    returnedErrors: [],
  };

  if (!body.categoryId) {
    ret.ok = false;
    ret.returnedErrors.push({
      field: 'categoryId',
      error: 'La catégorie est zobligatoire',
    });
  }

  return ret;
}
