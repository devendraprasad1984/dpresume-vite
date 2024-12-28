import { ReactElement } from "react";

interface Input {
  children: ReactElement;
  isDestructive?: boolean;
  onClick: (arg0?: any) => void;
  disabled?: boolean;
}

const DropDownItem = ({ children }: Input): ReactElement => {
  return children;
};

export default DropDownItem;
