import React from 'react';
import { Button, Text } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import styles from './not-found.module.scss';

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
            <Text className={styles.message__title}>Désolé, la page que vous cherchez n'existe pas. </Text>
            <Text className={styles.message__title}> Vous pouvez relancer une recherche ou vous rendre sur la page d'accueil</Text>
          </div>
          <Button
            onClick={() => navigate('/')}
          >
            En cliquant ici
          </Button>
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
                  Désolé, la page que vous cherchez n'existe pas.
                  <Text className={styles.message__title}> Vous pouvez relancer une recherche ou vous rendre sur la page d'accueil</Text>
                </Text>
              </Text>
              <Button
                onClick={() => navigate('/')}
              >
                En cliquant ici
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
