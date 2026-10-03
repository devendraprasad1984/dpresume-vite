const certs = ["cert1.png", "cert2.png", "cert3.png"];

const CertsView = () => {
  return <div className="col gap5 margin--y-20">
    <h2 className="dp-card__title">Certificates</h2>
    <div className="dp-certs">
      {certs.map((cert, index) => (
        <a
          key={cert}
          className="dp-cert reveal"
          style={{"--stagger": index + 1}}
          href={`/images/${cert}`}
          target="_blank"
          rel="noreferrer"
        >
          <img src={`/images/${cert}`} alt={`Certificate ${index + 1}`} loading="lazy"/>
        </a>
      ))}
    </div>
  </div>;
};

export default CertsView;
