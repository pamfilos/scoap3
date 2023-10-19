import React from "react";

const Footer = () => {
  const renderFooterLink = (href: string, text: string) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  );

  return (
    <div className="footer">
      <div className="container flex flex-col items-center">
        <div className="container-inner flex flex-col lg:flex-row justify-between items-center lg:items-start">
          <div className="footer-box flex-1">
            {renderFooterLink("https://scoap3.org/", "SCOAP3 website")} |{" "}
            {renderFooterLink("https://scoap3.org/scoap3-repository/", "About the repository")} |{" "}
            {renderFooterLink("https://scoap3.org/scoap3-repository/repository-help-2/", "Search help")}
          </div>
          <div className="footer-box text-center">
            Articles in the SCOAP3 repository are released under a{" "}
            {renderFooterLink("https://creativecommons.org/licenses/by/3.0/", "CC-BY")} license. Metadata are provided by the corresponding publishers and released under the a{" "}
            {renderFooterLink("https://creativecommons.org/publicdomain/zero/1.0/", "CC0")} waiver.
          </div>
          <div className="footer-box flex-1 text-right">
            Repository contact:{" "}
            {renderFooterLink("mailto:repo.admin@scoap3.org", "repo.admin@scoap3.org")}
          </div>
        </div>
        <div>
          <p className="text-muted">SCOAP3</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
