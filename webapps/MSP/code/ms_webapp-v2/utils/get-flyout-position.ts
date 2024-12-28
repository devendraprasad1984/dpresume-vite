type Output = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const getFlyoutPosition = (
  componentRef: HTMLElement,
  flyoutRef: HTMLElement,
  offsets: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  },
  preferredAlignment: string
): Output => {
  if (!componentRef || !flyoutRef) return;

  let flyoutTopPosition;
  let flyoutRightPosition;
  let flyoutBottomPosition;
  let flyoutLeftPosition;

  const topOffset = offsets?.top || 5;
  const leftOffset = offsets?.left || 0;
  const rightOffset = offsets?.right || 0;
  const bottomOffset = offsets?.bottom || 0;

  const componentRect = componentRef.getBoundingClientRect();
  const componentHeight = componentRef.offsetHeight;
  const flyoutWidth = flyoutRef.offsetWidth;
  const flyoutHeight = flyoutRef.offsetHeight;
  const viewportWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  const viewportHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );

  const componentToWindowDistanceBottom = viewportHeight - componentRect.bottom;

  // Horizontal visibility
  if (viewportWidth - componentRect.left < flyoutWidth) {
    // Case: Menu is off-screen to the right
    if (!preferredAlignment || preferredAlignment === "left") {
      flyoutLeftPosition = "unset";
      flyoutRightPosition = 9 + rightOffset;
    } else if (preferredAlignment === "right") {
      flyoutLeftPosition =
        componentRect.left + componentRect.width - flyoutWidth;
      flyoutRightPosition = "unset";
    }
  } else if (componentRect.left > flyoutWidth) {
    // Case Menu is horizontally visible within screen
    if (!preferredAlignment || preferredAlignment === "left") {
      flyoutLeftPosition = componentRect.left - leftOffset;
      flyoutRightPosition = "unset";
    } else if (preferredAlignment === "right") {
      flyoutLeftPosition =
        componentRect.left + componentRect.width - flyoutWidth;
      flyoutRightPosition = "unset";
    }
  } else if (componentRect.left <= flyoutWidth) {
    if (!preferredAlignment || preferredAlignment === "left") {
      flyoutLeftPosition = componentRect.left - leftOffset;
      flyoutRightPosition = "unset";
    }
  }

  // Vertical visibility
  if (componentToWindowDistanceBottom < flyoutHeight) {
    // Case: Menu is off-screen to the bottom
    flyoutTopPosition = "unset";
    flyoutBottomPosition = componentHeight + bottomOffset;
  } else if (componentToWindowDistanceBottom > flyoutHeight) {
    // Case: Menu is vertically visible within screen
    flyoutTopPosition = componentRect.bottom + topOffset; // give some space
    flyoutBottomPosition = "unset";
  }

  return {
    top: flyoutTopPosition,
    right: flyoutRightPosition,
    bottom: flyoutBottomPosition,
    left: flyoutLeftPosition,
  };
};

export default getFlyoutPosition;
