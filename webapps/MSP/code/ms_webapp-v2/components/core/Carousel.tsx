import React, { ReactNode } from "react";
import { Navigation, Pagination, A11y } from "swiper";
import { Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useMediaQuery } from "react-responsive";

import styles from "./Carousel.module.scss";

interface Props {
  children: ReactNode;
  slidesPerCard: {
    lg: number;
    md: number;
    sm: number;
    xs: number;
  };
}

const Carousel = ({ children, slidesPerCard }: Props) => {
  const isSizeXs = useMediaQuery(
    {
      minWidth: 320,
    },
    null
  );

  const isSizeSm = useMediaQuery(
    {
      minWidth: 768,
    },
    null
  );

  const isSizeMd = useMediaQuery(
    {
      minWidth: 1024,
    },
    null
  );

  const isSizeLg = useMediaQuery(
    {
      minWidth: 1368,
    },
    null
  );

  const numSlides =
    (isSizeLg && slidesPerCard.lg) ||
    (isSizeMd && slidesPerCard.md) ||
    (isSizeSm && slidesPerCard.sm) ||
    (isSizeXs && slidesPerCard.xs);

  return (
    <Swiper
      modules={[Navigation, Pagination, A11y]}
      spaceBetween={32}
      slidesPerView={numSlides}
      slidesPerGroup={numSlides}
      navigation={{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }}
      pagination={{ el: ".swiper-pagination", clickable: true }}
      className={styles.swiper}
    >
      {children}
      <div slot="container-end" className={styles.containerEnd}>
        <button type="button" className="swiper-button-prev" />
        <div className="swiper-pagination" />
        <button type="button" className="swiper-button-next" />
      </div>
    </Swiper>
  );
};

export default Carousel;
