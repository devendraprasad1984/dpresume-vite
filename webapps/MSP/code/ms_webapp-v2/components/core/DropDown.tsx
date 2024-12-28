import React, {
  useState,
  useRef,
  useEffect,
  ReactElement,
  ReactNode,
  SyntheticEvent,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import findIndex from "lodash/findIndex";
import useOnclickOutside from "react-cool-onclickoutside";
import classNames from "classnames";

import usePortal from "../../hooks/use-portal";
import getFlyoutPosition from "../../utils/get-flyout-position";
import styles from "./DropDown.module.scss";

interface Input {
  id: string;
  children: ReactNode;
  trigger: ReactElement;
  offsets?: { top?: number; right?: number; bottom?: number; left?: number };
  preferredAlignment?: "right" | "left";
  triggerType?: "click" | "hover";
}

const DropDown = ({
  id,
  children,
  trigger,
  offsets,
  preferredAlignment,
  triggerType = "click",
}: Input): ReactElement => {
  const target = usePortal("dropdown-root");
  const rootRef = useRef<HTMLDivElement>();
  const menuRef = useRef<HTMLDivElement>();

  const [isOpen, setIsOpen] = useState(false);
  const [menuTabIndex, setMenuTabIndex] = useState(-1);
  const [position, setPosition] = useState(null);

  const updateFlyoutPosition = () => {
    const newPosition = getFlyoutPosition(
      rootRef.current,
      menuRef.current,
      offsets,
      preferredAlignment
    );

    setPosition(newPosition);
  };

  const updatePosition = useCallback(updateFlyoutPosition, [
    offsets,
    preferredAlignment,
  ]);

  useOnclickOutside(
    () => {
      setIsOpen(false);
    },
    { refs: [rootRef, menuRef] }
  );

  useEffect(() => {
    if (isOpen) {
      setMenuTabIndex(0);
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  useScrollPosition(
    ({ prevPos, currPos }) => {
      if (isOpen && currPos.y !== prevPos.y) {
        updatePosition();
      }
    },
    [isOpen]
  );

  const toggleOpen = (e: SyntheticEvent) => {
    e && e.preventDefault();
    e && e.stopPropagation();

    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const handleOnClick = (e, onClick) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick();
    setIsOpen(false);
  };

  const handleOnKeyDown = (e, onClick) => {
    e.preventDefault();
    e.stopPropagation();
    const childCount = menuRef?.current?.childNodes?.length;
    const minIndex = 0;
    const maxIndex = childCount - 1;

    const firstChildNode = menuRef?.current?.childNodes[
      minIndex
    ] as HTMLElement;
    const lastChildNode = menuRef?.current?.childNodes[maxIndex] as HTMLElement;

    // Get current child index or set to the invisible option
    const currentFocusChildIndex = findIndex(
      menuRef?.current?.childNodes as NodeListOf<HTMLElement>,
      (item) => item.tabIndex === 0
    );
    const currentFocusChildNode = menuRef?.current?.childNodes[
      currentFocusChildIndex
    ] as HTMLElement;

    // Get next child index or reset to the first visible option
    const nextChildIndex =
      currentFocusChildIndex + 1 > maxIndex
        ? minIndex
        : currentFocusChildIndex + 1;
    const nextChildNode = menuRef?.current?.childNodes[
      nextChildIndex
    ] as HTMLElement;

    // Get next previous index or reset to the last visible option
    const previousChildIndex =
      currentFocusChildIndex - 1 <= 0 ? maxIndex : currentFocusChildIndex - 1;
    const previousChildNode = menuRef?.current?.childNodes[
      previousChildIndex
    ] as HTMLElement;

    switch (e.key) {
      case "ArrowDown":
        if (currentFocusChildNode) currentFocusChildNode.tabIndex = -1;
        nextChildNode.focus();
        nextChildNode.tabIndex = 0;
        break;
      case "ArrowUp":
        if (currentFocusChildNode) currentFocusChildNode.tabIndex = -1;
        previousChildNode.focus();
        previousChildNode.tabIndex = 0;
        break;
      case "Home":
        if (currentFocusChildNode) currentFocusChildNode.tabIndex = -1;
        firstChildNode.focus();
        firstChildNode.tabIndex = 0;
        break;
      case "End":
        if (currentFocusChildNode) currentFocusChildNode.tabIndex = -1;
        lastChildNode.focus();
        lastChildNode.tabIndex = 0;
        break;
      case "Escape":
      case "Tab":
        setIsOpen(false);
        break;
      case "Enter":
        if (onClick) onClick();
        break;
      default:
        break;
    }
  };

  const handleOnMouseEnter = () => {
    if (triggerType === "hover" && isOpen === false) {
      setTimeout(() => {
        setIsOpen(true);
      });
    }
  };

  const handleOnMouseLeave = () => {
    if (triggerType === "hover" && isOpen === true) {
      setTimeout(() => {
        setIsOpen(false);
      });
    }
  };

  const hoverTriggerStyle =
    triggerType === "hover"
      ? {
          paddingTop: offsets.top,
          marginTop: -offsets.top,
          paddingBottom: offsets.bottom,
          marginBottom: -offsets.bottom,
        }
      : {};

  return (
    <div
      ref={rootRef}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {React.cloneElement(trigger, {
        id,
        "aria-haspopup": true,
        "aria-expanded": isOpen,
        role: "menubutton",
        onClick: toggleOpen,
        onMouseDown: (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
      })}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={classNames(
              styles.dropdownMenu,
              isOpen && styles.dropdownMenuOpen
            )}
            role="menu"
            aria-labelledby={id}
            style={{
              ...position,
              ...hoverTriggerStyle,
            }}
            tabIndex={menuTabIndex}
          >
            <ul className={styles.dropdownMenuInner}>
              {React.Children.map(children, (child: ReactElement) => {
                if (!child) return false;
                const finalStyle = [styles.dropdownItem];
                if (child.props.isDestructive)
                  finalStyle.push(styles.destructiveOption);
                return (
                  <li
                    className={finalStyle.join(" ")}
                    role="menuitem"
                    tabIndex={-1}
                    onClick={(e) => handleOnClick(e, child.props.onClick)}
                    onKeyDown={(e) => handleOnKeyDown(e, child.props.onClick)}
                    aria-disabled={child.props.disabled}
                  >
                    {child}
                  </li>
                );
              })}
            </ul>
          </div>,
          target
        )}
    </div>
  );
};

export default DropDown;
