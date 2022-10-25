import { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Row,
  Select,
  Title,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import api from '../../../utils/api';
import validator from './validator';
import FormFooter from '../../forms/form-footer';
import useForm from '../../../hooks/useForm';
import { STRUCTURES_CREATION_REASONS, STRUCTURES_CLOSURE_REASONS } from '../../../utils/constants';
import DateInput from '../../date-input';
import SearchBar from '../../search-bar';

export default function WeblinkForm({ data, onDeleteHandler, onSaveHandler }) {
  // const [showErrors, setShowErrors] = useState(false);
  const [queryTOCreation, setQueryTOCreation] = useState('');
  const [scopeTOCreation, setScopeTOCreation] = useState(null);
  const [optionsTOCreation, setOptionsCreation] = useState([]);

  const [queryTOClosure, setQueryTOClosure] = useState('');
  const [scopeTOClosure, setScopeTOClosure] = useState(null);
  const [optionsTOClosure, setOptionsClosure] = useState([]);

  const { form, updateForm } = useForm(data, validator);

  const creationReasonsOptions = STRUCTURES_CREATION_REASONS.map((el) => ({ label: el, value: el }));
  const closureReasonsOptions = STRUCTURES_CLOSURE_REASONS.map((el) => ({ label: el, value: el }));

  // const onSave = () => {
  //   if (Object.keys(errors).length > 0) return setShowErrors(true);
  //   return onSaveHandler(form);
  // };

  useEffect(() => {
    const getAutocompleteResultCreation = async () => {
      const response = await api.get(`/autocomplete?query=${queryTOCreation}&types=officialTexts`);
      setOptionsCreation(response.data?.data);
    };
    if (queryTOCreation) { getAutocompleteResultCreation(); } else { setOptionsCreation([]); }
  }, [queryTOCreation]);

  useEffect(() => {
    const getAutocompleteResultClosure = async () => {
      const response = await api.get(`/autocomplete?query=${queryTOClosure}&types=officialTexts`);
      setOptionsClosure(response.data?.data);
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
        <div className="fr-notice fr-notice--info fr-mb-2w">
          <div className="fr-container">
            <div className="fr-notice__body">
              <p className="fr-notice__title">
                Pour mettre à jour les prédécesseurs et successeurs, rendez-vous dans la section
                {' '}
                <Link to="#">élément liés</Link>
              </p>
            </div>
          </div>
        </div>
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
              // message={(showErrors && errors.creationReason) ? errors.creationReason : null}
              // messageType={(showErrors && errors.creationReason) ? 'error' : ''}
            />
          </Col>
        </Row>
        <Row className="fr-pt-2w">
          <Col>
            <DateInput
              value={form?.creationDate}
              label="Date de début"
              onDateChange={(value) => updateForm({ creationDate: value })}
              isRequired
            />
          </Col>
        </Row>
        <Row className="fr-pt-2w">
          <Col>
            <SearchBar
              size="lg"
              buttonLabel="Rechercher"
              value={queryTOCreation}
              label="Ajouter/remplacer le texte officiel de création"
              hint="Rechercher et sélectionner un texte officiel"
              scope={scopeTOCreation}
              placeholder={scopeTOCreation ? '' : 'Rechercher...'}
              onChange={(e) => { updateForm({ creationOfficialTextId: null }); setQueryTOCreation(e.target.value); }}
              options={optionsTOCreation}
              onSelect={handleSelectCreation}
              onDeleteScope={handleUnselectCreation}
            />
          </Col>
        </Row>
        {
          (data?.creationOfficialText && form.creationOfficialTextId === data?.creationOfficialText.id) ? (
            <Row>
              <Col className="fr-p-1w">
                <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
                  <div className="fr-tile__body">
                    <h4 className="fr-tile__title">
                      <a
                        className="fr-tile__link"
                        href={`/textes-officiels/${data?.creationOfficialText.id}`}
                      >
                        {data?.creationOfficialText.title}
                      </a>
                    </h4>
                    <p className="fr-tile__desc">
                      {`${data?.creationOfficialText.type} publié le ${data?.creationOfficialText.publicationDate}`}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          ) : null
        }
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
              label="Raison de création"
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
              size="lg"
              buttonLabel="Rechercher"
              value={queryTOClosure}
              label="Ajouter/remplacer le texte officiel de fermeture"
              hint="Rechercher et sélectionner un texte officiel présent dans paysage"
              scope={scopeTOClosure}
              placeholder={scopeTOClosure ? '' : 'Rechercher...'}
              onChange={(e) => { updateForm({ closureOfficialTextId: null }); setQueryTOClosure(e.target.value); }}
              options={optionsTOClosure}
              onSelect={handleSelectClosure}
              onDeleteScope={handleUnselectClosure}
            />
          </Col>
        </Row>
        {
          (data?.closureOfficialText && form.closureOfficialTextId === data?.closureOfficialText.id) ? (
            <Row>
              <Col className="fr-p-1w">
                <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
                  <div className="fr-tile__body">
                    <h4 className="fr-tile__title">
                      <a
                        className="fr-tile__link"
                        href={`/textes-officiels/${data?.closureOfficialText.id}`}
                      >
                        {data?.closureOfficialText.title}
                      </a>
                    </h4>
                    <p className="fr-tile__desc">
                      {`${data?.closureOfficialText.type} publié le ${data?.closureOfficialText.publicationDate}`}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          ) : null
        }

        <FormFooter
          id={data?.id}
          onSaveHandler={() => onSaveHandler(form)}
          onDeleteHandler={onDeleteHandler}
        />
      </Container>
    </form>
  );
}

WeblinkForm.propTypes = {
  data: PropTypes.object,
  onDeleteHandler: PropTypes.func,
  onSaveHandler: PropTypes.func.isRequired,
};

WeblinkForm.defaultProps = {
  data: {},
  onDeleteHandler: null,
};
