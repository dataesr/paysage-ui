import React from 'react';
import { Button, Text, Title, Col, Row } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import './not-found.scss';

const randomDisplay = Math.floor(Math.random() * 2);

export default function NotFound() {
  const navigate = useNavigate();

  return randomDisplay === 1 ? (
    <div>
      <div className="top-header" />
      <div>
        <div className="starsec" />
        <div className="starthird" />
        <div className="starfourth" />
        <div className="starfifth" />
      </div>
      <div className="lamp__wrap">
        <div className="lamp">
          <div className="cable" />
          <div className="cover" />
          <div className="in-cover">
            <div className="bulb" />
          </div>
          <div className="light" />
        </div>
      </div>
      <div className="error">
        <div className="error__content">
          <div className="error__message message">
            <Text className="message__title">Page Introuvable!</Text>
            <Text className="message__text">Désolé, la page que vous cherchez n'existe pas. </Text>
            <Text className="message__text"> Vous pouvez relancer une recherche ou vous rendre sur la page d'accueil</Text>
          </div>
          <Button
            onClick={() => navigate('/')}
          >
            En cliquant ici
          </Button>
          <Text className="error__nav e-nav" />
        </div>

      </div>

    </div>
  ) : (
    <div className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1  text-center">
              <div className="four_zero_four_bg">
                <Title className="message__title">Page Introuvable!</Title>
              </div>
              <Text>
                <Text className="h2">
                  Désolé, la page que vous cherchez n'existe pas.
                  <Text> Vous pouvez relancer une recherche ou vous rendre sur la page d'accueil</Text>
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
