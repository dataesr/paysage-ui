export default function validation(body) {
  const ret = {};
  if (!body?.value) {
    ret.value = "La valeur de l'identifiant est obligatoire";
  }

  return ret;
}
