import React, { ReactElement } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import DropDown from "./DropDown";
import DropDownItem from "./DropDownItem";
import styles from "./MoreActions.module.scss";
import MoreButton from "../buttons/MoreButton";
import IconsUtil from "./IconsUtil";
import { IPossibleIconValues } from "../../@types/Icons";

export interface IMoreAction {
  key: string;
  name: string;
  icon: IPossibleIconValues;
  onClick: (data: any) => void;
  isDestructive?: boolean;
  hideIf?: { key: string; value: string | boolean }[] | any;
  disabled?: boolean;
}

interface Props {
  id: string;
  data?: any;
  subtle?: boolean;
  actions: IMoreAction[];
  size?: "sm" | "md";
  Button?: ReactElement;
}

const MoreActions = observer(
  ({
    id,
    data,
    subtle,
    actions,
    size = "md",
    Button = <MoreButton size={size} subtle={subtle} />,
  }: Props) => {
    return (
      <DropDown id={id} trigger={Button}>
        {actions
          .filter((action) => {
            const isHideIfBoolean = typeof action?.hideIf === "boolean";
            if (isHideIfBoolean) {
              return action.hideIf;
            } else {
              return action.hideIf
                ? action.hideIf
                    ?.map(
                      (condition) => data?.[condition?.key] !== condition.value
                    )
                    ?.every((item) => item === true)
                : true;
            }
          })
          .map((action) => (
            <DropDownItem
              key={action.key}
              onClick={() => action.onClick(data)}
              isDestructive={action.isDestructive}
              disabled={action.disabled}
            >
              <div
                className={classNames(
                  styles.itemGroup,
                  action.isDestructive && styles.destructiveItemGroup
                )}
              >
                <IconsUtil icon={action.icon} />
                <span>{action.name}</span>
              </div>
            </DropDownItem>
          ))}
      </DropDown>
    );
  }
);

export default MoreActions;
