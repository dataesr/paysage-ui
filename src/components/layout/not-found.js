import React from 'react';
import { Button } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import './not-found.scss';

const randomDisplay = Math.floor(Math.random() * 2);

export default function NotFound() {
  const navigate = useNavigate();

  return randomDisplay === 1 ? (
    <div>
      <header className="top-header" />
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
      <section className="error">
        <div className="error__content">
          <div className="error__message message">
            <h1 className="message__title">Page Introuvable!</h1>
            <p className="message__text">Désolé, la page que vous cherchez n'existe pas. </p>
            <p className="message__text"> Vous pouvez relancer une recherche ou vous rendre sur la page d'accueil</p>
          </div>
          <Button
            onClick={() => navigate('/')}
          >
            En cliquant ici
          </Button>
          <div className="error__nav e-nav" />
        </div>

      </section>

    </div>
  ) : (
    <section className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1  text-center">
              <div className="four_zero_four_bg">
                <h1 className="text-center ">Page Introuvable!</h1>
              </div>
              <div className="contant_box_404">
                <h3 className="h2">
                  Désolé, la page que vous cherchez n'existe pas.
                </h3>
                <h3 className="h2"> Vous pouvez relancer une recherche ou vous rendre sur la page d'accueil</h3>
              </div>
              <Button
                onClick={() => navigate('/')}
              >
                En cliquant ici
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
