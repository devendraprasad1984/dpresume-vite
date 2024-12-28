import React, {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import useOnclickOutside from "react-cool-onclickoutside";

import Search from "../core/Search";

import Message from "../../public/static/icons/Messages.svg";
import People from "../../public/static/icons/Match.svg";
import Companies from "../../public/static/icons/Companies.svg";
import Topics from "../../public/static/icons/ViewTopic.svg";
import Sessions from "../../public/static/icons/Sessions.svg";
import Jobs from "../../public/static/icons/Briefcase.svg";
import GenericSearchIcon from "../../public/static/icons/Magnifier.svg";
import CloseIcon from "../../public/static/icons/Close.svg";

const resultIcons = {
    Message: Message,
    People: People,
    Companies: Companies,
    Topics: Topics,
    Sessions: Sessions,
    Jobs: Jobs,
    Search: GenericSearchIcon,
};

import styles from "./GlobalSearch.module.scss";
import classNames from "classnames";

const TextInput = observer(() => {
    const [searchHints, setSearchHints] = useState([]);
    const [recentSearches, setRecentSearches] = useState(null);

    const [searchString, setSearchString] = useState("");
    const [resultsPanelOpen, setResultsPanelOpen] = useState(false);
    const firstResultsRef = useRef(null);

    // Toggles the results/recent box
    const showBox = (e) => {
        e.stopPropagation();
        setResultsPanelOpen(true);
    };
    const hideBox = () => {
        setTimeout(() => {
            const isInsidePopup =
                document.activeElement.closest(`.${styles.resultsBox}`) === null;
            if (isInsidePopup) {
                setResultsPanelOpen(false);
            }
        }, 100);
    };
    const resultsPanelRef = useOnclickOutside(() => {
        const inside = document.activeElement.closest(`.${styles.searchWrap}`);
        if (!inside) {
            setResultsPanelOpen(false);
        }
    });

    // Will kick the focus into the suggestion if the right key is pressed
    const jumpFocusedElement = (e) => {
        if (e.key === "Tab" && firstResultsRef.current != null) {
            e.preventDefault();
            firstResultsRef.current.focus();
        }
    };

    // Store the search they just clicked
    const storeSearch = (e) => {
        if (searchString.trim() !== "") {
            setRecentSearches([
                {
                    icon: e.target.closest("a").dataset.icon,
                    label: searchString,
                },
                ...recentSearches,
            ]);
            localStorage.setItem(
                "globalRecentSearches",
                JSON.stringify(recentSearches)
            );
        }
    };

    // Remove a saved recent search
    const removeRecentSearch = (index) => {
        const newRecentSearches = [...recentSearches];
        newRecentSearches.splice(index, 1);
        setRecentSearches(newRecentSearches);
        setSearchHints(newRecentSearches);
        localStorage.setItem(
            "globalRecentSearches",
            JSON.stringify(recentSearches)
        );
    };

    // Lets figure out what should be in that list, and in one case bing a listener.
    useEffect(() => {
        if (searchString.trim() != "") {
            setSearchHints([
                {
                    icon: `Message`,
                    label: `<strong>${searchString}</strong> in Messages`,
                },
                {
                    icon: `People`,
                    label: `<strong>${searchString}</strong> in People`,
                },
                {
                    icon: `Companies`,
                    label: `<strong>${searchString}</strong> in Companies`,
                },
                {
                    icon: `Topics`,
                    label: `<strong>${searchString}</strong> in Topics`,
                },
                {
                    icon: `Sessions`,
                    label: `<strong>${searchString}</strong> in Sessions`,
                },
                {
                    icon: `Jobs`,
                    label: `<strong>${searchString}</strong> in Jobs`,
                },
                {
                    icon: `Search`,
                    label: `<strong>${searchString}</strong>`,
                },
            ]);
        } else if (recentSearches === null) {
            try {
                const savedSearches = JSON.parse(localStorage["globalRecentSearches"]);
                setRecentSearches(savedSearches);
            } catch (e) {
                setRecentSearches([]);
            }
        } else {
            setSearchHints(recentSearches);
        }
    }, [searchString, recentSearches]);

    // The input itself
    return (
        <span className={styles.searchWrap}>
      <Search
          className={styles.searchInput}
          onChange={(value) => {
              setSearchString(value);
          }}
          placeholder={"Search MSPCommunity"}
          onFocus={showBox}
          onBlur={hideBox}
          onKeyDown={jumpFocusedElement}
      />
      <div
          className={classNames(
              styles.resultsBox,
              resultsPanelOpen ? "open" : "closed"
          )}
          ref={resultsPanelRef}
      >
        {searchString == "" ? (
            <h5 className={styles.resultsHeader}>Recent Searches</h5>
        ) : null}
          <ol>
          {searchHints.length > 0 ? null : (
              <li
                  className={classNames(styles.item, styles.noitem)}
                  key={`autocomplete-suggestion-none`}
              >
                  No Recent Searches
              </li>
          )}
              {searchHints.map((option, index) => {
                  const Icon = resultIcons[option.icon];
                  return (
                      <li
                          className={styles.item}
                          key={`autocomplete-suggestion-${option.icon}-${option.label}`}
                          tabIndex={9000 + index} // 9000 is used so the results are tab index but outside of the regular tab flow
                          ref={index == 0 ? firstResultsRef : null}
                          onBlur={hideBox}
                      >
                          <a
                              href="#"
                              onClick={storeSearch}
                              className={styles.link}
                              data-icon={option.icon}
                          >
                              <Icon className={styles.icon}/>
                              <div
                                  className={styles.label}
                                  dangerouslySetInnerHTML={{__html: option.label}}
                              />
                              {searchString == "" ? (
                                  <CloseIcon
                                      className={styles.close}
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          removeRecentSearch(index);
                                      }}
                                  />
                              ) : null}
                          </a>
                      </li>
                  );
              })}
        </ol>
      </div>
    </span>
    );
});

export default TextInput;
