import SlidesData from '../data/slides'

export const getSlideDetails = (slideNumber) => {
    return SlidesData.filter(slide => slide.page === slideNumber)[0]
}