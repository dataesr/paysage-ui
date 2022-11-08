import { Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import { useState } from 'react';

import IdentifierForm from '../../forms/identifier';
import ExpendableListCards from '../../card/expendable-list-cards';
import {
  Bloc,
  BlocActionButton,
  BlocContent,
  BlocModal,
  BlocTitle,
} from '../../bloc';
import api from '../../../utils/api';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import useNotice from '../../../hooks/useNotice';
import {
  deleteError,
  saveError,
  saveSuccess,
  deleteSuccess,
} from '../../../utils/notice-contents';
import KeyValueCard from '../../card/key-value-card';
import { getTvaIntraFromSiren } from '../../../utils/get-tva-intra';

export default function IdentifiersComponent() {
  const { notice } = useNotice();
  const { url, apiObject } = useUrl('identifiers');
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const onSaveHandler = async (body, itemId) => {
    const method = itemId ? 'patch' : 'post';
    const saveUrl = itemId ? `${url}/${itemId}` : url;
    await api[method](saveUrl, body)
      .then(() => {
        notice(saveSuccess);
        reload();
      })
      .catch(() => notice(saveError));
    return setShowModal(false);
  };

  const onDeleteHandler = async (itemId) => {
    await api
      .delete(`${url}/${itemId}`)
      .then(() => {
        notice(deleteSuccess);
        reload();
      })
      .catch(() => notice(deleteError));
    return setShowModal(false);
  };

  const onOpenModalHandler = (element) => {
    setModalTitle(
      element?.id ? "Modification d'un identifiant" : "Ajout d'un identifiant",
    );
    setModalContent(
      <IdentifierForm
        id={element?.id}
        data={element || {}}
        onDelete={onDeleteHandler}
        onSave={onSaveHandler}
      />,
    );
    setShowModal(true);
  };

  const getLink = (el) => {
    let linkTo = '';
    switch (el.type) {
    case 'Wikidata':
      linkTo = `https://wikidata.org/wiki/${el.value}`;
      break;
    case 'Wikidata JSON':
      linkTo = `https://www.wikidata.org/wiki/Special:EntityData/${el.value}.json`;
      break;
    case 'idRef':
      linkTo = `https://www.idref.fr/${el.value}`;
      break;
    case 'ORCID':
      linkTo = `https://orcid.org/${el.value}`;
      break;
    case 'ROR':
      linkTo = `https://ror.org/${el.value}`;
      break;
    case 'RNA':
      linkTo = `https://entreprise.data.gouv.fr/etablissement/${el.value}`;
      break;
    case 'Siret':
      linkTo = `https://annuaire-entreprises.data.gouv.fr/etablissement/${el.value.split(' ').join('')}`;
      break;
    case 'Siren':
      linkTo = `https://annuaire-entreprises.data.gouv.fr/entreprise/${el.value.split(' ').join('')}`;
      break;
    case 'OC':
      linkTo = `https://opencorporates.com/companies/${el.value}`;
      break;
    case 'RNSR':
      linkTo = `https://appliweb.dgri.education.fr/rnsr/PresenteStruct.jsp?numNatStruct=${el.value}&PUBLIC=OK`;
      break;
    case 'Id unité CNRS':
      linkTo = `https://web-ast.dsi.cnrs.fr/l3c/owa/structure.infos_admin?&p_lab=${el.value}&p_origine_appel=u`;
      break;
    case 'CNRS - grafilabo':
      linkTo = `https://www2.cnrs.fr/graflabo/unite.php?cod_uni=${el.value}`;
      break;
    case 'RCR':
      linkTo = `http://www.sudoc.abes.fr//DB=2.2/SET=1/TTL=3/CMD?ACT=SRCHA&IKT=8888&SRT=RLV&TRM=${el.value}`;
      break;
    case 'isni':
      linkTo = `http://www.isni.org/${el.value.split(' ').join('')}`;
      break;
    case 'fundref':
      linkTo = `https://search.crossref.org/funding?q=${el.value}`;
      break;
    case 'PIC':
      linkTo = `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/how-to-participate/org-details/${el.value}`;
      break;
    case 'PIA':
      linkTo = `https://anr.fr/ProjetIA-${el.value}`;
      break;
    case 'Identifiant BnF':
      linkTo = `https://catalogue.bnf.fr/ark:/12148/cb${el.value}`;
      break;
    case 'idHal':
      linkTo = `https://aurehal.archives-ouvertes.fr/structure/read/id/${el.value}`;
      break;
    case 'cvHal':
      linkTo = `https://cv.archives-ouvertes.fr/${el.value}`;
      break;
    case 'WOS':
      linkTo = `https://publons.com/researcher/${el.value}/`;
      break;
    case 'These':
      linkTo = `http://www.theses.fr/${el.value}`;
      break;
    case 'UNIVD':
      linkTo = `https://univ-droit.fr/universitaires/${el.value}`;
      break;
    case 'ALId':
      linkTo = `https://dgesip-annelis.adc.education.fr/etablissement/${el.value}`;
      break;
    default:
    }
    return linkTo;
  };

  const renderCards = () => {
    if (!data) return null;
    const list = [];
    if (data) {
      data?.data?.forEach((el) => {
        if (el.type === 'Id unité CNRS') {
          list.push(
            <KeyValueCard
              cardKey="Voir dans GraFiLabo"
              cardValue={el.value}
              className={`card-${apiObject}`}
              copy
              icon="ri-fingerprint-2-line"
              key={el.id}
              onEdit={() => onOpenModalHandler(el)}
              linkTo={getLink({ ...el, type: 'CNRS - grafilabo' })}
            />,
          );
        }
        if (el.type === 'Wikidata') {
          list.push(
            <KeyValueCard
              cardKey="Wikidata Fichier JSON"
              cardValue={el.value}
              className={`card-${apiObject}`}
              copy
              icon="ri-fingerprint-2-line"
              key={el.id}
              onEdit={() => onOpenModalHandler(el)}
              linkTo={getLink({ ...el, type: 'Wikidata JSON' })}
            />,
          );
        }
        if (el.type === 'EtId') {
          list.push(
            <KeyValueCard
              cardKey="Identifiant établissement ESGBU"
              cardValue={el.value}
              className={`card-${apiObject}`}
              copy
              icon="ri-fingerprint-2-line"
              key={el.id}
              onEdit={() => onOpenModalHandler(el)}
            />,
          );
        }
        if (el.type === 'SdId') {
          list.push(
            <KeyValueCard
              cardKey="Identifiant service documentaire ESGBU"
              cardValue={el.value}
              className={`card-${apiObject}`}
              copy
              icon="ri-fingerprint-2-line"
              key={el.id}
              onEdit={() => onOpenModalHandler(el)}
            />,
          );
        }
        if (el.type === 'BibId') {
          list.push(
            <KeyValueCard
              cardKey="Identifiant bibliothèque ESGBU"
              cardValue={el.value}
              className={`card-${apiObject}`}
              copy
              icon="ri-fingerprint-2-line"
              key={el.id}
              onEdit={() => onOpenModalHandler(el)}
            />,
          );
        }
        if (el.type === 'isni') {
          list.push(
            <KeyValueCard
              cardKey="Identifiant isni"
              cardValue={el.value}
              className={`card-${apiObject}`}
              copy
              icon="ri-fingerprint-2-line"
              key={el.id}
              onEdit={() => onOpenModalHandler(el)}
              linkTo={getLink(el)}
            />,
          );
        }
        if (el.type === 'Siret') {
          const siren = el.value.substring(0, 11);
          list.push(
            <KeyValueCard
              cardKey="Siren"
              cardValue={siren}
              className={`card-${apiObject}`}
              copy
              icon="ri-fingerprint-2-line"
              key={el.id}
              onEdit={() => onOpenModalHandler(el)}
              linkTo={getLink({ ...el, type: 'Siren' })}
            />,
          );
          list.push(
            <KeyValueCard
              cardKey="Numéro de TVA"
              cardValue={getTvaIntraFromSiren(siren)}
              className={`card-${apiObject}`}
              copy
              icon="ri-fingerprint-2-line"
              key={el.id}
              onEdit={() => onOpenModalHandler(el)}
            />,
          );
        }
        list.push(
          <KeyValueCard
            cardKey={el.type}
            cardValue={el.value}
            className={`card-${apiObject}`}
            copy
            icon="ri-fingerprint-2-line"
            key={el.id}
            onEdit={() => onOpenModalHandler(el)}
            linkTo={getLink(el)}
          />,
        );
      });
    }
    return <ExpendableListCards list={list} />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h4">
        Identifiants
      </BlocTitle>
      <BlocActionButton onClick={() => onOpenModalHandler()}>
        Ajouter un identifiant
      </BlocActionButton>
      <BlocContent>{renderCards()}</BlocContent>
      <BlocModal>
        <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
          <ModalTitle>{modalTitle}</ModalTitle>
          <ModalContent>{modalContent}</ModalContent>
        </Modal>
      </BlocModal>
    </Bloc>
  );
}
