import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Col,
  Container,
  Row,
  Stepper,
  Tag,
  Text,
  TextInput,
  Title,
  TagGroup,
  Select,
} from '@dataesr/react-dsfr';
import TagInput from '../../components/tag-input';
import Button from '../../components/button';
import DateInput from '../../components/date-input';
import useForm from '../../hooks/useForm';
import useNotice from '../../hooks/useNotice';
import api from '../../utils/api';
import { STRUCTURES_CLOSURE_REASONS, STRUCTURES_CREATION_REASONS } from '../../utils/constants';
import SearchBar from '../../components/search-bar';

const steps = ['Identifiants', 'Dénominations', 'Création et fermeture'];

const stepProps = {
  globalForm: PropTypes.shape.isRequired,
  updateGlobalForm: PropTypes.func.isRequired,
  setStep: PropTypes.func.isRequired,
};

function IdentifiersStep({ globalForm, updateGlobalForm, setStep }) {
  const validateForm = (body) => {
    const validationErrors = {};
    if (body.rnsr && !/^[0-9]{9}[A-Z]{1}$/.test(body.rnsr)) { validationErrors.rnsr = "Le numero RNSR doit être composé de 9 chiffres suivi d'une lettre majuscule"; }
    if (body.siret && !/^[0-9]{14}$/.test(body.siret)) { validationErrors.siret = 'Le numero Siret doit être composé de 14 chiffres'; }
    return validationErrors;
  };
  const { form, updateForm, errors } = useForm(globalForm, validateForm);
  const [showErrors, setShowErrors] = useState(false);
  const handleNextStep = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    updateGlobalForm({ ...form });
    return setStep({ step: 2 });
  };
  return (
    <>
      <Row>
        <Text>
          Si vous connaissez des identifiants de la structure, renseignez-les, ils pourront vous aider à remplir certains champs dans le reste du formulaire.
          <br />
          Si vous ne connaissez pas d'identifiant, allez directement à l'étape suivante.
        </Text>
      </Row>
      <Row gutters alignItems="top">
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Identifiant Siret"
            hint="Système Informatique pour le Répertoire des Entreprises sur le Territoire"
            value={form.siret}
            onChange={(e) => updateForm({ siret: e.target.value })}
            message={(showErrors && errors.siret) ? errors.siret : null}
            messageType={(showErrors && errors.siret) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Identifiant Wikidata"
            hint="Wikidata"
            value={form.wikidata}
            onChange={(e) => updateForm({ wikidata: e.target.value })}
            message={(showErrors && errors.wikidata) ? errors.wikidata : null}
            messageType={(showErrors && errors.wikidata) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Identifiant RNSR"
            hint="Répertoire National des Structures de Recherche"
            value={form.rnsr}
            onChange={(e) => updateForm({ rnsr: e.target.value })}
            message={(showErrors && errors.rnsr) ? errors.rnsr : null}
            messageType={(showErrors && errors.rnsr) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Identifiant ROR"
            hint="Registre des Organismes de Recherche https://ror.org"
            value={form.ror}
            onChange={(e) => updateForm({ ror: e.target.value })}
            message={(showErrors && errors.ror) ? errors.ror : null}
            messageType={(showErrors && errors.ror) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Identifiant UAI"
            hint="Unité Administrative Immatriculée"
            value={form.uai}
            onChange={(e) => updateForm({ uai: e.target.value })}
            message={(showErrors && errors.uai) ? errors.uai : null}
            messageType={(showErrors && errors.uai) ? 'error' : ''}
          />
        </Col>
      </Row>
      <Row className="fullwidth" justifyContent="right">
        <Button onClick={handleNextStep}>Étape suivante</Button>
      </Row>
    </>
  );
}

IdentifiersStep.propTypes = stepProps;

function DenominationStep({ prefiller, globalForm, updateGlobalForm, setStep }) {
  const validateForm = (body) => {
    const validationErrors = {};
    if (!body.usualName) { validationErrors.usualName = 'Le nom usuel est obligatoire'; }
    return validationErrors;
  };
  const { form, updateForm, errors } = useForm(globalForm, validateForm);
  const [showErrors, setShowErrors] = useState(false);
  const handleNextStep = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    updateGlobalForm({ ...form });
    return setStep({ step: 3 });
  };
  return (
    <>
      <Row gutters alignItems="top">
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            className="fr-mb-0"
            label="Nom usuel"
            message={(showErrors && errors.usualName) ? errors.usualName : null}
            messageType={(showErrors && errors.usualName) ? 'error' : ''}
            onChange={(e) => updateForm({ usualName: e.target.value })}
            required
            value={form.usualName}
          />
          <TagGroup className="fr-mt-1w">
            {prefiller?.rnsr?.name?.label && (
              <Tag
                selected={form.usualName === prefiller.rnsr.name.label}
                icon={(form.usualName !== prefiller.rnsr.name.label) && 'ri-arrow-up-line'}
                iconPosition="right"
                className="no-span"
                onClick={() => updateForm({ usualName: prefiller.rnsr.name.label })}
              >
                {`RNSR: ${prefiller.rnsr.name.label}`}
              </Tag>
            )}
          </TagGroup>
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Nom officiel"
            value={form.officialName}
            onChange={(e) => updateForm({ officialName: e.target.value })}
            message={(showErrors && errors.officialName) ? errors.officialName : null}
            messageType={(showErrors && errors.officialName) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Nom court"
            value={form.shortName}
            onChange={(e) => updateForm({ shortName: e.target.value })}
            message={(showErrors && errors.shortName) ? errors.shortName : null}
            messageType={(showErrors && errors.shortName) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput label="Acronyme" value={form.acronymFr} onChange={(e) => updateForm({ acronymFr: e.target.value })} />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Nom en anglais"
            value={form.nameEn}
            onChange={(e) => updateForm({ nameEn: e.target.value })}
            message={(showErrors && errors.nameEn) ? errors.nameEn : null}
            messageType={(showErrors && errors.nameEn) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput label="Acronyme en anglais" value={form.acronymEn} onChange={(e) => updateForm({ acronymEn: e.target.value })} />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TagInput
            label="Alias"
            hint='Ajouter toutes les dénominations de la structure. Valider chaque nom avec la touche "Entrée"'
            tags={form.otherNames || []}
            onTagsChange={(tags) => updateForm({ otherNames: tags })}
          />
        </Col>
      </Row>
      <hr />
      <Row className="fullwidth flex--space-between">
        <Button secondary onClick={() => setStep({ step: 1 })}>Précédent</Button>
        <Button onClick={handleNextStep}>Étape suivante</Button>
      </Row>
    </>
  );
}

DenominationStep.propTypes = { ...stepProps, prefiller: PropTypes.shape.isRequired };

function HistoryStep({ globalForm, handleSave, updateGlobalForm, setStep }) {
  // const [showErrors, setShowErrors] = useState(false);
  const [isSearchingCreation, setIsSearchingCreation] = useState(false);
  const [optionsTOCreation, setOptionsCreation] = useState([]);
  const [queryTOCreation, setQueryTOCreation] = useState('');
  const [scopeTOCreation, setScopeTOCreation] = useState(null);

  const [isSearchingClosure, setIsSearchingClosure] = useState(false);
  const [optionsTOClosure, setOptionsClosure] = useState([]);
  const [queryTOClosure, setQueryTOClosure] = useState('');
  const [scopeTOClosure, setScopeTOClosure] = useState(null);

  const { form, updateForm } = useForm(globalForm);

  const creationReasonsOptions = [{ label: 'Sélectionner', value: '' }, ...STRUCTURES_CREATION_REASONS.map((el) => ({ label: el, value: el }))];
  const closureReasonsOptions = [{ label: 'Sélectionner', value: '' }, ...STRUCTURES_CLOSURE_REASONS.map((el) => ({ label: el, value: el }))];

  const handleNextStep = (e) => {
    e.preventDefault();
    // if (Object.keys(errors).length !== 0) return setShowErrors(true);
    updateGlobalForm({ ...form });
    return handleSave(form);
  };
  useEffect(() => {
    const getAutocompleteResultCreation = async () => {
      setIsSearchingCreation(true);
      const response = await api.get(`/autocomplete?query=${queryTOCreation}&types=official-texts`);
      setOptionsCreation(response.data?.data);
      setIsSearchingCreation(false);
    };
    if (queryTOCreation) { getAutocompleteResultCreation(); } else { setOptionsCreation([]); }
  }, [queryTOCreation]);

  useEffect(() => {
    const getAutocompleteResultClosure = async () => {
      setIsSearchingClosure(true);
      const response = await api.get(`/autocomplete?query=${queryTOClosure}&types=official-texts`);
      setOptionsClosure(response.data?.data);
      setIsSearchingClosure(false);
    };
    if (queryTOClosure) { getAutocompleteResultClosure(); } else { setOptionsClosure([]); }
  }, [queryTOClosure]);

  const handleSelectCreation = ({ id, name }) => {
    updateForm({ creationOfficialTextId: id });
    setScopeTOCreation(name);
    setQueryTOCreation('');
    setOptionsCreation([]);
  };
  const handleUnselectCreation = () => {
    updateForm({ creationOfficialTextId: null });
    setScopeTOCreation(null);
    setQueryTOCreation('');
    setOptionsCreation([]);
  };

  const handleSelectClosure = ({ id, name }) => {
    updateForm({ closureOfficialTextId: id });
    setScopeTOClosure(name);
    setQueryTOClosure('');
    setOptionsClosure([]);
  };
  const handleUnselectClosure = () => {
    updateForm({ closureOfficialTextId: null });
    setScopeTOClosure(null);
    setQueryTOClosure('');
    setOptionsClosure([]);
  };

  return (
    <form>
      <Container>
        <Row>
          <Col>
            <Title as="h3" look="h6">
              Création
            </Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Select
              label="Raison de création"
              options={creationReasonsOptions}
              selected={form?.creationReason}
              onChange={(e) => updateForm({ creationReason: e.target.value })}
              tabIndex={0}
            />
          </Col>
        </Row>
        <Row className="fr-pt-2w">
          <Col>
            <DateInput
              value={form?.creationDate}
              label="Date de création"
              onDateChange={(value) => updateForm({ creationDate: value })}
              isRequired
            />
          </Col>
        </Row>
        <Row className="fr-pt-2w">
          <Col>
            <SearchBar
              buttonLabel="Rechercher"
              hint="Rechercher et sélectionner un texte officiel"
              isSearching={isSearchingCreation}
              label="Ajouter / remplacer le texte officiel de création"
              onChange={(e) => { updateForm({ creationOfficialTextId: null }); setQueryTOCreation(e.target.value); }}
              onDeleteScope={handleUnselectCreation}
              onSelect={handleSelectCreation}
              options={optionsTOCreation}
              placeholder={scopeTOCreation ? '' : 'Rechercher...'}
              scope={scopeTOCreation}
              size="lg"
              value={queryTOCreation}
            />
          </Col>
        </Row>
        <Row className="fr-pt-5w">
          <Col>
            <Title as="h3" look="h6">
              Fermeture
            </Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Select
              label="Raison de fermeture"
              options={closureReasonsOptions}
              selected={form?.closureReason}
              onChange={(e) => updateForm({ closureReason: e.target.value })}
            />
          </Col>
        </Row>
        <Row className="fr-pt-2w">
          <Col>
            <DateInput
              value={form?.closureDate}
              label="Date de fermeture"
              onDateChange={(value) => updateForm({ closureDate: value })}
            />
          </Col>
        </Row>
        <Row className="fr-pt-2w">
          <Col>
            <SearchBar
              buttonLabel="Rechercher"
              hint="Rechercher et sélectionner un texte officiel"
              isSearching={isSearchingClosure}
              label="Ajouter / remplacer le texte officiel de fermeture"
              onChange={(e) => { updateForm({ closureOfficialTextId: null }); setQueryTOClosure(e.target.value); }}
              onDeleteScope={handleUnselectClosure}
              onSelect={handleSelectClosure}
              options={optionsTOClosure}
              placeholder={scopeTOClosure ? '' : 'Rechercher...'}
              scope={scopeTOClosure}
              size="lg"
              value={queryTOClosure}
            />
          </Col>
        </Row>
        <hr />
        <Row className="fullwidth flex--space-between">
          <Button secondary onClick={() => setStep({ step: 1 })}>Précédent</Button>
          <Button onClick={handleNextStep}>Créer la structure</Button>
        </Row>
      </Container>
    </form>
  );
}

HistoryStep.propTypes = { ...stepProps, handleSave: PropTypes.func.isRequired };

export default function StructureAddPage() {
  const { notice } = useNotice();
  const navigate = useNavigate();
  const validateForm = (body) => {
    const validationErrors = {};
    if (!body.usualNameFr) { validationErrors.usualNameFr = 'Le nom usuel en français est obligatoire'; }
    return validationErrors;
  };
  const { form, updateForm } = useForm({}, validateForm);
  const [prefiller] = useState(null);
  const [step, setStep] = useSearchParams();
  const currentStep = parseInt(step.get('step'), 10) || 1;

  const handleSave = async (body) => {
    const response = await api.post('/structures', body).catch(() => {
      notice({ content: "Une erreur s'est produite lors de l'envoi", autoDismissAfter: 0, type: 'error' });
      setStep({ step: 1 });
    });
    if (response.ok) {
      navigate(`/structures/${response.data.id}`);
    } else {
      notice({ content: "Une erreur s'est produite lors de l'envoi", autoDismissAfter: 0, type: 'error' });
    }
  };

  // TODO: Add prefiller like example below.Don't forget to reset setPrefiller
  // useEffect(() => {
  //   // const fetchRNSR = async (rnsr) => {
  //   //   const response = await fetch(`http://${rnsr}`);
  //   //   const data = await response.json();
  //   //   return data.data;
  //   // };
  //   if (/^[0-9]{9}[A-Z]{1}$/.test(form.rnsr)) {
  //     // const rnsrData = fetchRNSR(form.rnsr);
  //     setPrefiller({ ...prefiller, rnsr: { id: '200918525B', name: { label: 'Testlabel' } } });
  //   }
  // }, [form, prefiller, setPrefiller]);

  return (
    <Container spacing="mb-6w">
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>
              Accueil
            </BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/contribuer" />}>
              Ajouter un nouvel objet
            </BreadcrumbItem>
            <BreadcrumbItem>Ajouter une structure</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h2">Ajouter une structure</Title>
        </Col>
      </Row>
      <Container fluid>
        <Row justifyContent="center">
          <Col>
            <Stepper
              currentStep={currentStep}
              steps={3}
              currentTitle={steps[currentStep - 1]}
              nextStepTitle={steps[currentStep]}
            />
          </Col>
        </Row>
        <hr />
        {(currentStep === 1) && <IdentifiersStep globalForm={form} setStep={setStep} updateGlobalForm={updateForm} />}
        {(currentStep === 2) && <DenominationStep globalForm={form} prefiller={prefiller} setStep={setStep} updateGlobalForm={updateForm} />}
        {(currentStep === 3) && <HistoryStep globalForm={form} handleSave={handleSave} setStep={setStep} updateGlobalForm={updateForm} />}
      </Container>
    </Container>
  );
}
