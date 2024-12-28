import { LocalVideoTrack, Room } from "twilio-video";
import { useState, useEffect, useCallback } from "react";
import {
  GaussianBlurBackgroundProcessor,
  VirtualBackgroundProcessor,
  ImageFit,
  isSupported,
} from "@twilio/video-processors";

import { SELECTED_BACKGROUND_SETTINGS_KEY } from "../../constants";
const Abstract = "/static/twilio/images/Abstract.jpg";
const AbstractThumb = "/static/twilio/images/thumb/Abstract.jpg";
const BohoHome = "/static/twilio/images/BohoHome.jpg";
const BohoHomeThumb = "/static/twilio/images/thumb/BohoHome.jpg";
const Bookshelf = "/static/twilio/images/Bookshelf.jpg";
const BookshelfThumb = "/static/twilio/images/thumb/Bookshelf.jpg";
const CoffeeShop = "/static/twilio/images/CoffeeShop.jpg";
const CoffeeShopThumb = "/static/twilio/images/thumb/CoffeeShop.jpg";
const Contemporary = "/static/twilio/images/Contemporary.jpg";
const ContemporaryThumb = "/static/twilio/images/thumb/Contemporary.jpg";
const CozyHome = "/static/twilio/images/CozyHome.jpg";
const CozyHomeThumb = "/static/twilio/images/thumb/CozyHome.jpg";
const Desert = "/static/twilio/images/Desert.jpg";
const DesertThumb = "/static/twilio/images/thumb/Desert.jpg";
const Fishing = "/static/twilio/images/Fishing.jpg";
const FishingThumb = "/static/twilio/images/thumb/Fishing.jpg";
const Flower = "/static/twilio/images/Flower.jpg";
const FlowerThumb = "/static/twilio/images/thumb/Flower.jpg";
const Kitchen = "/static/twilio/images/Kitchen.jpg";
const KitchenThumb = "/static/twilio/images/thumb/Kitchen.jpg";
const ModernHome = "/static/twilio/images/ModernHome.jpg";
const ModernHomeThumb = "/static/twilio/images/thumb/ModernHome.jpg";
const Nature = "/static/twilio/images/Nature.jpg";
const NatureThumb = "/static/twilio/images/thumb/Nature.jpg";
const Ocean = "/static/twilio/images/Ocean.jpg";
const OceanThumb = "/static/twilio/images/thumb/Ocean.jpg";
const Patio = "/static/twilio/images/Patio.jpg";
const PatioThumb = "/static/twilio/images/thumb/Patio.jpg";
const Plant = "/static/twilio/images/Plant.jpg";
const PlantThumb = "/static/twilio/images/thumb/Plant.jpg";
const SanFrancisco = "/static/twilio/images/SanFrancisco.jpg";
const SanFranciscoThumb = "/static/twilio/images/thumb/SanFrancisco.jpg";
import { Thumbnail } from "../BackgroundThumbnail";

export interface BackgroundSettings {
  type: Thumbnail;
  index?: number;
}

const imageNames: string[] = [
  "Abstract",
  "Boho Home",
  "Bookshelf",
  "Coffee Shop",
  "Contemporary",
  "Cozy Home",
  "Desert",
  "Fishing",
  "Flower",
  "Kitchen",
  "Modern Home",
  "Nature",
  "Ocean",
  "Patio",
  "Plant",
  "San Francisco",
];

const images = [
  AbstractThumb,
  BohoHomeThumb,
  BookshelfThumb,
  CoffeeShopThumb,
  ContemporaryThumb,
  CozyHomeThumb,
  DesertThumb,
  FishingThumb,
  FlowerThumb,
  KitchenThumb,
  ModernHomeThumb,
  NatureThumb,
  OceanThumb,
  PatioThumb,
  PlantThumb,
  SanFranciscoThumb,
];

const rawImagePaths = [
  Abstract,
  BohoHome,
  Bookshelf,
  CoffeeShop,
  Contemporary,
  CozyHome,
  Desert,
  Fishing,
  Flower,
  Kitchen,
  ModernHome,
  Nature,
  Ocean,
  Patio,
  Plant,
  SanFrancisco,
];

const imageElements = new Map();

const getImage = (index: number): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (imageElements.has(index)) {
      return resolve(imageElements.get(index));
    }
    const img = new Image();
    img.onload = () => {
      imageElements.set(index, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = rawImagePaths[index];
  });
};

export const backgroundConfig = {
  imageNames,
  images,
};

const virtualBackgroundAssets = "/static/twilio";
let blurProcessor: GaussianBlurBackgroundProcessor;
let virtualBackgroundProcessor: VirtualBackgroundProcessor;

export default function useBackgroundSettings(
  videoTrack: LocalVideoTrack | undefined,
  room?: Room | null
) {
  const [backgroundSettings, setBackgroundSettings] =
    useState<BackgroundSettings>(() => {
      const localStorageSettings = window.localStorage.getItem(
        SELECTED_BACKGROUND_SETTINGS_KEY
      );
      return localStorageSettings
        ? JSON.parse(localStorageSettings)
        : { type: "none", index: 0 };
    });

  const removeProcessor = useCallback(() => {
    if (videoTrack && videoTrack.processor) {
      videoTrack.removeProcessor(videoTrack.processor);
    }
  }, [videoTrack]);

  const addProcessor = useCallback(
    (
      processor: GaussianBlurBackgroundProcessor | VirtualBackgroundProcessor
    ) => {
      if (!videoTrack || videoTrack.processor === processor) {
        return;
      }
      removeProcessor();
      videoTrack.addProcessor(processor);
    },
    [videoTrack, removeProcessor]
  );

  useEffect(() => {
    if (!isSupported) {
      return;
    }
    // make sure localParticipant has joined room before applying video processors
    // this ensures that the video processors are not applied on the LocalVideoPreview
    const handleProcessorChange = async () => {
      if (!blurProcessor) {
        blurProcessor = new GaussianBlurBackgroundProcessor({
          assetsPath: virtualBackgroundAssets,
          blurFilterRadius: 15,
          maskBlurRadius: 5,
        });
        await blurProcessor.loadModel();
      }
      if (!virtualBackgroundProcessor) {
        virtualBackgroundProcessor = new VirtualBackgroundProcessor({
          assetsPath: virtualBackgroundAssets,
          backgroundImage: await getImage(0),
          fitType: ImageFit.Cover,
          maskBlurRadius: 5,
        });
        await virtualBackgroundProcessor.loadModel();
      }
      if (!room?.localParticipant) {
        return;
      }

      if (backgroundSettings.type === "blur") {
        addProcessor(blurProcessor);
      } else if (
        backgroundSettings.type === "image" &&
        typeof backgroundSettings.index === "number"
      ) {
        virtualBackgroundProcessor.backgroundImage = await getImage(
          backgroundSettings.index
        );
        addProcessor(virtualBackgroundProcessor);
      } else {
        removeProcessor();
      }
    };
    handleProcessorChange();
    window.localStorage.setItem(
      SELECTED_BACKGROUND_SETTINGS_KEY,
      JSON.stringify(backgroundSettings)
    );
  }, [backgroundSettings, videoTrack, room, addProcessor, removeProcessor]);

  return [backgroundSettings, setBackgroundSettings] as const;
}
