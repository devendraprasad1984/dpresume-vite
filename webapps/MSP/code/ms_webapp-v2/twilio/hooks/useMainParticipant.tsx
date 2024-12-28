import useVideoContext from "./useVideoContext";
import useDominantSpeaker from "./useDominantSpeaker";
import useParticipants from "./useParticipants";
import useScreenShareParticipant from "./useScreenShareParticipant";
import useSelectedParticipant from "../components/VideoProvider/useSelectedParticipant";

export default function useMainParticipant() {
  const [selectedParticipant] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();
  const dominantSpeaker = useDominantSpeaker();
  const participants = useParticipants();
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant;
  const remoteScreenShareParticipant =
    screenShareParticipant !== localParticipant ? screenShareParticipant : null;

  // The participant that is returned is displayed in the main video area. Changing the order of the following
  // variables will change the how the main speaker is determined.
  return (
    selectedParticipant ||
    remoteScreenShareParticipant ||
    dominantSpeaker ||
    participants[0] ||
    localParticipant
  );
}
