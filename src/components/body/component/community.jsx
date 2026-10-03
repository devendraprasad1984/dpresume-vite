import PrintList from "./printList.jsx";

const oneliners = <div className="col gap1">
  <span className="skill-label wt500">Oneliners</span>
  <span className="size12 text-muted">core javascript utility helper methods</span>
  <span className="size12 bold">
    npm i oneliners <a className="hyperlink link-sweep" href="https://www.npmjs.com/package/oneliners" target="_blank" rel="noreferrer">read me</a>
  </span>
</div>;

const Community = () => {
  return <div className="dp-card hover-lift anim-shimmer">
    <div className="dp-card__title">Community</div>
    {PrintList([oneliners], "counter-color-peach", "grid2x2")}
  </div>;
};

export default Community;
