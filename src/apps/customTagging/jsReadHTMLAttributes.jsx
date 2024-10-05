import React from "react";
import "../../hooks/useJSReadHTMLAttributes.js";
import useJSReadHTMLAttributes from "../../hooks/useJSReadHTMLAttributes.js";

const JsReadHTMLAttributes = () => {
  useJSReadHTMLAttributes();
  
  return <div>
    <h1 className="mainHead">This is pure js based page where custom tag and js does it all</h1>
    <div className="row">
      <div className="column">
        <h1>Call from comments API</h1>
        <DPTag id="idcomments" name="Comments" data='{"data":[],"fields":["body","name","email"]}'
               replaceWithApi="https://jsonplaceholder.typicode.com/comments" fn="processData('dp','pras')"/>
      </div>

      <div className="column">
        <h1>Call from Posts API</h1>
        <DPTag id="idposts" name="Posts" data='{"data":[],"fields":["title","body","userId"]}'
               replaceWithApi="https://jsonplaceholder.typicode.com/posts"/>
      </div>
    </div>

    <div className="row">
      <div className="column">
        <h1>Call from Album API</h1>
        <DPTag id="idAlbum" name="Albums" data='{"data":[]}' autopull="true"
               replaceWithApi="https://jsonplaceholder.typicode.com/albums"/>
      </div>
    </div>

    <div className="row">
      <div className="column">
        <h1>Call from local data array</h1>
        <DPTag id="id2" name="p_10_50" data='{"data":[10,20,30,40,50]}' updateWithData="true"/>
      </div>
    </div>
  </div>;
};
export default JsReadHTMLAttributes;
