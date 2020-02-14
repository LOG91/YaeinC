import React from 'react';
import './Footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitch, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-main__logo">Yaein</div>
        <div className="positioning--rel">
          <ul className="footer-main__list">
            <li className="footer-main__item">
              <a href="https://www.instagram.com/yaein_holy/" target="_blank" className="footer-main__a">
                <FontAwesomeIcon className="footer-main__logo--sns" icon={faInstagram} />
              </a>
            </li>
            <li className="footer-main__item">
              <a href="#" className="footer-main__a">
                <FontAwesomeIcon className="footer-main__logo--sns" icon={faTwitch} />
              </a>
            </li>
            <li className="footer-main__item">
              <a href="https://www.youtube.com/channel/UCU8p5jB-jdIdg3ey_MTg1Wg" target="_blank" className="footer-main__a">
                <FontAwesomeIcon className="footer-main__logo--sns" icon={faYoutube} />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-main__description">16706 경기도 수원시 영통구 매영로 269번길 15  TEL : 031-204-5004  |  FAX : 031-205-9181</div>
    </footer>
  )
}

export default Footer;