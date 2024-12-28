import { useEffect, useState, ReactNode } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

interface Props {
  loadNext: (number) => Promise<boolean>;
  distanceFromEnd?: number;
  loader?: ReactNode;
  complete?: ReactNode;
  className?: string;
  children: ReactNode;
}

const ForeverScroll = observer(
  ({
    loadNext,
    distanceFromEnd = 500,
    loader,
    complete,
    className,
    children,
  }: Props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    // This binds to the window scroll, and unbinds when no longer needed
    useEffect(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    });

    // Sets waiting to true, updated the internal page counter, and fires off a new load
    const handleScroll = async () => {
      const pixelsFromBottom =
        document.body.offsetHeight - (window.innerHeight + window.scrollY);
      if (pixelsFromBottom < distanceFromEnd && !isLoading && !isComplete) {
        setIsLoading(true);
        setCurrentPage(currentPage + 1);
        const complete = await loadNext(currentPage + 1);
        setIsComplete(complete === true);
        setIsLoading(false);
      }
    };

    // Returns children, and adds a loader/complete message if provided
    return (
      <div className={classNames(className)}>
        {children}
        {isLoading ? loader : null}
        {isComplete ? complete : null}
      </div>
    );
  }
);

export default ForeverScroll;
