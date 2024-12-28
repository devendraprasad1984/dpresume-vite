import {Checker, Regex} from "fnpm/validators";

const isValidWebsite = (value: string) =>
    value ? Checker.isMatch(Regex.url(), value) : true;

const isValidYouTube = (value: string) =>
    value ? Checker.isMatch(Regex.socialMediaLink("youtube"), value) : true;

const isValidLinkedIn = (value: string) =>
    value ? Checker.isMatch(Regex.socialMediaLink("linkedin"), value) : true;

const isValidFacebook = (value: string) =>
    value ? Checker.isMatch(Regex.socialMediaLink("facebook"), value) : true;

const isValidInstagram = (value: string) =>
    value ? Checker.isMatch(Regex.socialMediaLink("instagram"), value) : true;

const isValidTwitter = (value: string) =>
    value ? Checker.isMatch(Regex.socialMediaLink("twitter"), value) : true;

export {
    isValidWebsite,
    isValidYouTube,
    isValidLinkedIn,
    isValidFacebook,
    isValidInstagram,
    isValidTwitter,
};
