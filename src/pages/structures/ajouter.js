import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Col,
  Container,
  RadioGroup,
  Radio,
  Row,
  Stepper,
  Tag,
  Text,
  TextInput,
  Title,
  TagGroup,
  Highlight,
} from '@dataesr/react-dsfr';
import TagInput from '../../components/tag-input';
import Button from '../../components/button';
import DateInput from '../../components/date-input';
import Map from '../../components/map';
import useForm from '../../hooks/useForm';
import useNotice from '../../hooks/useNotice';
import api from '../../utils/api';

const steps = ['Identifiants', 'Dénominations', 'Adresse', 'Création et fermeture'];

const stepProps = {
  globalForm: PropTypes.shape.isRequired,
  updateGlobalForm: PropTypes.func.isRequired,
  setStep: PropTypes.func.isRequired,
};

function IdentifiersStep({ globalForm, updateGlobalForm, setStep }) {
  const validateForm = (body) => {
    const validationErrors = {};
    if (body.rnsr && !/^[0-9]{9}[A-Z]{1}$/.test(body.rnsr)) { validationErrors.rnsr = "Le numero RNSR doit être composé de 9 chiffres suivi d'une lettre majuscule"; }
    if (body.siret && !/^[0-9]{14}[A-Z]{1}$/.test(body.siret)) { validationErrors.siret = 'Le numero Siret doit être composé de 14 chiffres'; }
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
          Si vous connaissez des identifiants de la structure, renseignez-les, ils pourrons vous aider à remplir certains champs dans le reste du formulaire.
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
            hint="Système Informatique pour le Répertoire des Entreprises sur le Territoire"
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
            hint="Registre des organismes de recherche https://ror.org"
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
            required
            className="fr-mb-0"
            label="Nom usuel"
            value={form.usualName}
            onChange={(e) => updateForm({ usualName: e.target.value })}
            message={(showErrors && errors.usualName) ? errors.usualName : null}
            messageType={(showErrors && errors.usualName) ? 'error' : ''}
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
          <TextInput label="Acronyme" value={form.acronymFr} onChange={(e) => updateForm({ acronymFr: e.target.value })} />
        </Col>
        <Col n="12 md-6" />
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
          <TextInput label="Acronym en anglais" value={form.acronymEn} onChange={(e) => updateForm({ acronymEn: e.target.value })} />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TagInput
            label="Alias"
            hint='Ajoutez toutes les dénominations de la structure. Validez chaque nom avec la touche "Entrée"'
            tags={form.otherNames || []}
            onTagsChange={(tags) => updateForm({ otherNames: tags })}
          />
        </Col>
      </Row>
      <hr />
      <Row className="fullwidth fr-row--space-between">
        <Button secondary onClick={() => setStep({ step: 1 })}>Précédent</Button>
        <Button onClick={handleNextStep}>Étape suivante</Button>
      </Row>
    </>
  );
}

DenominationStep.propTypes = { ...stepProps, prefiller: PropTypes.shape.isRequired };

function LocalisationStep({ globalForm, updateGlobalForm, setStep }) {
  const validateForm = (body) => {
    const validationErrors = {};
    if (!body.country) { validationErrors.country = 'Le pays est obligatoire'; }
    return validationErrors;
  };
  const { form, updateForm, errors } = useForm(globalForm, validateForm);
  const [showErrors, setShowErrors] = useState(false);
  const handleNextStep = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    updateGlobalForm({ ...form });
    return setStep({ step: 4 });
  };
  return (
    <>
      <Row gutters alignItems="top">
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            required
            label="Pays"
            value={form.country}
            onChange={(e) => updateForm({ country: e.target.value })}
            message={(showErrors && errors.country) ? errors.country : null}
            messageType={(showErrors && errors.country) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Commune"
            value={form.city}
            onChange={(e) => updateForm({ city: e.target.value })}
            message={(showErrors && errors.city) ? errors.city : null}
            messageType={(showErrors && errors.city) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Mention de distribution"
            value={form.distributionStatement}
            onChange={(e) => updateForm({ distributionStatement: e.target.value })}
            message={(showErrors && errors.distributionStatement) ? errors.distributionStatement : null}
            messageType={(showErrors && errors.distributionStatement) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Adresse"
            value={form.address}
            onChange={(e) => updateForm({ address: e.target.value })}
            message={(showErrors && errors.address) ? errors.address : null}
            messageType={(showErrors && errors.address) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Code postal"
            value={form.postalCode}
            onChange={(e) => updateForm({ postalCode: e.target.value })}
            message={(showErrors && errors.postalCode) ? errors.postalCode : null}
            messageType={(showErrors && errors.postalCode) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Boite postale"
            value={form.postOfficeBoxNumber}
            onChange={(e) => updateForm({ postOfficeBoxNumber: e.target.value })}
            message={(showErrors && errors.postOfficeBoxNumber) ? errors.postOfficeBoxNumber : null}
            messageType={(showErrors && errors.postOfficeBoxNumber) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Localité d'acheminement"
            value={form.locality}
            onChange={(e) => updateForm({ locality: e.target.value })}
            message={(showErrors && errors.locality) ? errors.locality : null}
            messageType={(showErrors && errors.locality) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6" />
        <Col n="12 md-6" spacing="pb-3w">
          <Map />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <Highlight>Ajuster les coordonnées en selectionnant un point sur la carte ou en entrant manuellement latitude et longitude</Highlight>
          <TextInput
            label="Latitude"
            value={form.lat}
            onChange={(e) => updateForm({ lat: e.target.value })}
            message={(showErrors && errors.lat) ? errors.lat : null}
            messageType={(showErrors && errors.lat) ? 'error' : ''}
          />
          <TextInput
            label="Longitude"
            value={form.lng}
            onChange={(e) => updateForm({ lng: e.target.value })}
            message={(showErrors && errors.lng) ? errors.lng : null}
            messageType={(showErrors && errors.lng) ? 'error' : ''}
          />
        </Col>
      </Row>
      <hr />
      <Row className="fullwidth fr-row--space-between">
        <Button secondary onClick={() => setStep({ step: 2 })}>Précédent</Button>
        <Button onClick={handleNextStep}>Étape suivante</Button>
      </Row>
    </>
  );
}

LocalisationStep.propTypes = stepProps;

function HistoryStep({ globalForm, handleSave, updateGlobalForm, setStep }) {
  const validateForm = (body) => {
    const validationErrors = {};
    if (!body.country) { validationErrors.country = 'Le pays est obligatoire'; }
    return validationErrors;
  };
  const { form, updateForm, errors } = useForm(globalForm, validateForm);
  const [showErrors, setShowErrors] = useState(false);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    // handle approximateDate
    updateGlobalForm({ ...form });
    return handleSave();
  };
  return (
    <>
      <Row gutters className="fullwidth" alignItems="top">
        <Col n="12">
          <RadioGroup required isInline legend="Status de la structure">
            <Radio
              label="Active"
              value
              checked={form.structureStatus === 'active'}
              onChange={() => updateForm({ structureStatus: 'active' })}
            />
            <Radio
              label="Inactive"
              value={false}
              checked={form.structureStatus === 'inactive'}
              onChange={() => updateForm({ structureStatus: 'inactive' })}
            />
            <Radio
              label="Potentielle"
              value={false}
              checked={form.structureStatus === 'forthcomming'}
              onChange={() => updateForm({ structureStatus: 'forthcomming' })}
            />
          </RadioGroup>
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <DateInput
            value={form.creationDate}
            label="Date de création"
            onDateChange={(value) => updateForm({ creationDate: value })}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Texte officiel de création"
            value={form.city}
            onChange={(e) => updateForm({ city: e.target.value })}
            message={(showErrors && errors.city) ? errors.city : null}
            messageType={(showErrors && errors.city) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <DateInput
            value={form.closureDate}
            label="Date de Fermeture"
            onDateChange={(value) => updateForm({ closureDate: value })}
          />
        </Col>
        <Col n="12 md-6" spacing="pb-3w">
          <TextInput
            label="Texte officiel de fermeture"
            value={form.city}
            onChange={(e) => updateForm({ city: e.target.value })}
            message={(showErrors && errors.city) ? errors.city : null}
            messageType={(showErrors && errors.city) ? 'error' : ''}
          />
        </Col>
      </Row>
      <hr />
      <Row className="fullwidth fr-row--space-between">
        <Button secondary onClick={() => setStep({ step: 3 })}>Précédent</Button>
        <Button onClick={handleNextStep}>Étape suivante</Button>
      </Row>
    </>
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
  const [prefiller, setPrefiller] = useState(null);
  const [step, setStep] = useSearchParams();
  const currentStep = parseInt(step.get('step'), 10) || 1;

  const handleSave = async () => {
    const response = await api.post('/structures', form).catch(() => {
      notice({ content: "Une erreur s'est produite lors de l'envoi", autoDismissAfter: 0, type: 'error' });
      setStep({ step: 1 });
    });
    if (response.ok) {
      navigate(`/structures/${response.data.id}`);
    } else {
      notice({ content: "Une erreur s'est produite lors de l'envoi", autoDismissAfter: 0, type: 'error' });
    }
  };

  useEffect(() => {
    // const fetchRNSR = async (rnsr) => {
    //   const response = await fetch(`http://${rnsr}`);
    //   const data = await response.json();
    //   return data.data;
    // };
    if (/^[0-9]{9}[A-Z]{1}$/.test(form.rnsr)) {
      // const rnsrData = fetchRNSR(form.rnsr);
      setPrefiller({ ...prefiller, rnsr: { id: '200918525B', name: { label: 'Testlabel' } } });
    }
  }, [form, prefiller, setPrefiller]);

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
              steps={4}
              currentTitle={steps[currentStep - 1]}
              nextStepTitle={steps[currentStep]}
            />
          </Col>
        </Row>
        <hr />
        {(currentStep === 1) && <IdentifiersStep globalForm={form} setStep={setStep} updateGlobalForm={updateForm} />}
        {(currentStep === 2) && <DenominationStep globalForm={form} prefiller={prefiller} setStep={setStep} updateGlobalForm={updateForm} />}
        {(currentStep === 3) && <LocalisationStep globalForm={form} setStep={setStep} updateGlobalForm={updateForm} />}
        {(currentStep === 4) && <HistoryStep globalForm={form} handleSave={handleSave} setStep={setStep} updateGlobalForm={updateForm} />}
      </Container>
    </Container>
  );
}
