import React from 'react';
import { Button, Col, Row, Text } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';

const randomDisplay = Math.floor(Math.random() * 2);

export default function NotFound() {
  const navigate = useNavigate();

  return randomDisplay === 1 ? (
    <div>
      <div />
      <div>
        <div className={styles.starsec} />
        <div className={styles.starthird} />
        <div className={styles.starfourth} />
        <div className={styles.starfifth} />
      </div>
      <div className={styles.lamp__wrap}>
        <div className={styles.lamp}>
          <div className={styles.cable} />
          <div className={styles.cover} />
          <div className={styles['in-cover']}>
            <div className={styles.bulb} />
          </div>
          <div className={styles.light} />
        </div>
      </div>
      <div className={styles.error}>
        <div className={styles.error__content}>
          <div className={styles.error__message}>
            <Text className={styles.message__title}>Page Introuvable!</Text>
            <Text className={styles.message__title}>Désolé, la page que vous cherchez n'existe pas, ou bien vous n'êtes pas connecté avec vos identifiants. </Text>
            <Text className={styles.message__title}> Vous pouvez relancer une recherche ou vous rendre sur la page d'accueil</Text>
          </div>
          <Row gutters alignItems="middle" justifyContent="center" spacing="mb-md-3w">
            <Col>
              <Button
                onClick={() => navigate('/')}
              >
                Cliquez ici pour la page d'accueil
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                onClick={() => navigate('/se-connecter')}
              >
                Cliquez ici pour vous connecter
              </Button>
            </Col>
          </Row>
          <Text className={styles['error__nav e-nav']} />
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.page_404}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1  text-center">
              <div className={styles.four_zero_four_bg}>
                <Text className={styles.message__title}>Page Introuvable!</Text>
              </div>
              <Text>
                <Text className={styles.message__title}>
                  Désolé, la page que vous cherchez n'existe pas, ou bien vous n'êtes pas connecté avec vos identifiants.
                  <Text className={styles.message__title}> Vous pouvez relancer une recherche ou vous rendre sur la page d'accueil</Text>
                </Text>
              </Text>
              <Row gutters alignItems="middle" justifyContent="center" spacing="mb-md-3w">
                <Col>
                  <Button
                    onClick={() => navigate('/')}
                  >
                    Cliquez ici pour la page d'accueil
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    onClick={() => navigate('/se-connecter')}
                  >
                    Cliquez ici pour vous connecter
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
