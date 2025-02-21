import PropTypes from 'prop-types';
import Button from '../../../../../components/button';
import useNotice from '../../../../../hooks/useNotice';
import api from '../../../../../utils/api';

export default function DismissButton({ id, reload }) {
  const { notice } = useNotice();

  return (
    <Button
      size="sm"
      type="button"
      secondary
      onClick={() => api.patch(`/sirene/updates/${id}`, { status: 'ok' })
        .then(() => {
          reload();
          notice({ content: 'Ignoré.', autoDismissAfter: 6000, type: 'success' });
        })
        .catch(() => notice({
          content: "Une erreur s'est produite",
          autoDismissAfter: 6000,
          type: 'error',
        }))}
    >
      Ignorer
    </Button>
  );
}

DismissButton.propTypes = {
  id: PropTypes.string.isRequired,
  reload: PropTypes.func,
};

DismissButton.defaultProps = {
  reload: () => { },
};
