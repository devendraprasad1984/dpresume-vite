import PropTypes from "prop-types";
import React from "react";

export default function Article({ article }) {
  article.propTypes = {
    title: PropTypes.string.isRequired,
    upvotes: PropTypes.string.isRequired,
    date: PropTypes.object.isRequired,
  };
  const displayArticle = () => {
    return article.map((x, i) => {
      return (
        <div key={"row" + i}>
          {x.title} - {x.upvotes} - {x.date}
        </div>
      );
    });
  };
  if (article === undefined) return null;
  if (article.length === 0) return null;
  return (
    <div>
      <h2>Articles</h2>
      {displayArticle()}
    </div>
  );
}
Article.propTypes = {
  article: PropTypes.array.isRequired,
};
