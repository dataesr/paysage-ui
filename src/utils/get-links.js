export default function getLink(el) {
  let linkTo = '';
  switch (el.type) {
  case 'annelis':
    linkTo = `https://dgesip-annelis.adc.education.fr/etablissement/${el.value}`;
    break;
  case 'bnf':
    linkTo = `https://catalogue.bnf.fr/ark:/12148/cb${el.value}`;
    break;
  case 'cnrs-grafilabo':
    linkTo = `https://www2.cnrs.fr/graflabo/unite.php?cod_uni=${el.value}`;
    break;
  case 'cnrs-unit':
    linkTo = `https://web-ast.dsi.cnrs.fr/l3c/owa/structure.infos_admin?&p_lab=${el.value}&p_origine_appel=u`;
    break;
  case 'crunchbase':
    linkTo = `https://www.crunchbase.com/organization/${el.value}`;
    break;
  case 'euTransparency':
    linkTo = `https://ec.europa.eu/transparencyregister/public/consultation/displaylobbyist.do?id=${el.value}&isListLobbyistView=true&locale=fr#fr`;
    break;
  case 'dealroom':
    linkTo = `https://app.dealroom.co/companies/${el.value}`;
    break;
  case 'fundref':
    linkTo = `https://search.crossref.org/funding?q=${el.value}`;
    break;
  case 'googleScholar':
    if (el.value.length === 12) {
      linkTo = `https://scholar.google.co.jp/citations?hl=en&user=${el.value}`;
    } else {
      linkTo = `https://scholar.google.co.jp/citations?view_op=view_org&hl=en&org=${el.value}`;
    }
    break;
  case 'hatvp':
    linkTo = `https://www.hatvp.fr/fiche-organisation/?organisation=${el.value}`;
    break;
  case 'idhal':
    linkTo = `https://aurehal.archives-ouvertes.fr/structure/read/id/${el.value}`;
    break;
  case 'idref':
    linkTo = `https://www.idref.fr/${el.value}`;
    break;
  case 'isni':
    linkTo = `http://www.isni.org/${el.value.split(' ').join('')}`;
    break;
  case 'nnt':
    linkTo = `http://www.theses.fr/${el.value}`;
    break;
  case 'oc':
    linkTo = `https://opencorporates.com/companies/${el.value}`;
    break;
  case 'openAlexStructId':
    linkTo = ` https://openalex.org/${el.value}`;
    break;
  case 'orcid':
    linkTo = `https://orcid.org/${el.value}`;
    break;
  case 'pia':
    linkTo = `https://anr.fr/ProjetIA-${el.value}`;
    break;
  case 'pic':
    linkTo = `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/how-to-participate/org-details/${el.value}`;
    break;
  case 'researchgate':
    linkTo = `https://www.researchgate.net/profile/${el.value}`;
    break;
  case 'rcr':
    linkTo = `http://www.sudoc.abes.fr//DB=2.2/SET=1/TTL=3/CMD?ACT=SRCHA&IKT=8888&SRT=RLV&TRM=${el.value}`;
    break;
  case 'rna':
    linkTo = `https://www.data-asso.fr/annuaire/association/${el.value}?docFields=documentsDac,documentsRna`;
    break;
  case 'rnsr':
    linkTo = `https://appliweb.dgri.education.fr/rnsr/PresenteStruct.jsp?numNatStruct=${el.value}&PUBLIC=OK`;
    break;
  case 'ror':
    linkTo = `https://ror.org/${el.value}`;
    break;
  case 'scopus':
    linkTo = `https://www.scopus.com/authid/detail.uri?authorId=${el.value}`;
    break;
  case 'siren':
    linkTo = `https://annuaire-entreprises.data.gouv.fr/entreprise/${el.value.split(' ').join('')}`;
    break;
  case 'siret':
    linkTo = `https://annuaire-entreprises.data.gouv.fr/etablissement/${el.value.split(' ').join('')}`;
    break;
  case 'univ-droit':
    linkTo = `https://univ-droit.fr/universitaires/${el.value}`;
    break;
  case 'wikidata':
    linkTo = `https://wikidata.org/wiki/${el.value}`;
    break;
  case 'wikidata_json':
    linkTo = `https://www.wikidata.org/wiki/Special:EntityData/${el.value}.json`;
    break;
  case 'wos':
    linkTo = `https://publons.com/researcher/${el.value}/`;
    break;
  default:
  }
  return linkTo;
}
