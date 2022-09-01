import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Tag, TagGroup, TextInput } from '@dataesr/react-dsfr';

export default function TagInput({ label, hint, tags, onTagsChange }) {
  const [input, setInput] = useState('');
  const [values, setValues] = useState(tags);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input) {
        setValues([...values, input]);
      }
      setInput('');
    }
  };

  useEffect(() => onTagsChange(values), [values, onTagsChange]);

  return (
    <div>
      <div>
        <Row alignItems="bottom">
          <Col>
            <TextInput
              type="text"
              value={input}
              label={label}
              hint={hint}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Col>
        </Row>
        <Row>
          <Col className="fr-pt-2w">
            <TagGroup>
              {values.map((tag, i) => (
                <Tag
                  // eslint-disable-next-line react/no-array-index-key
                  key={`tag-${i}`}
                  className="fr-mr-1w"
                  onClick={() => {
                    setValues([...values.filter((el) => el !== tag)]);
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </TagGroup>
          </Col>
        </Row>
      </div>
    </div>
  );
}

TagInput.propTypes = {
  hint: PropTypes.string,
  label: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  onTagsChange: PropTypes.func.isRequired,
};

TagInput.defaultProps = {
  hint: 'Validez votre ajout avec la touche "Entrée" afin de valider votre ajout',
  tags: [],
};
