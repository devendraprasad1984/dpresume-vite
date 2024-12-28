import React, { useCallback } from "react";

import Restore from "../../public/static/icons/Restore.svg";
import Edit from "../../public/static/icons/Edit.svg";
import Pause from "../../public/static/icons/Pause.svg";
import Note from "../../public/static/icons/Note.svg";
import Key from "../../public/static/icons/Key.svg";
import Trash from "../../public/static/icons/Trash.svg";
import Message from "../../public/static/icons/MessageCircle.svg";
import MessageEdit from "../../public/static/icons/Message.svg";
import People from "../../public/static/icons/People.svg";
import Video from "../../public/static/icons/Video.svg";
import VideoPlus from "../../public/static/icons/VideoPlus.svg";
import BellOff from "../../public/static/icons/BellOff.svg";
import Bell from "../../public/static/icons/Bell.svg";
import Flag from "../../public/static/icons/NavFlag.svg";
import Settings from "../../public/static/icons/Settings.svg";
import PeoplePlus from "../../public/static/icons/PeoplePlus.svg";
import ScheduleSession from "../../public/static/icons/ScheduleSession.svg";
import EditTopic from "../../public/static/icons/EditTopic.svg";
import ViewTopic from "../../public/static/icons/ViewTopic.svg";
import Crown from "../../public/static/icons/Crown.svg";
import GroupMemberChatEdit from "../../public/static/icons/GroupMemberChatEdit.svg";
import SearchChat from "../../public/static/icons/SearchChat.svg";
import Folder from "../../public/static/icons/Folder.svg";
import Minus from "../../public/static/icons/minus.svg";
import Plus from "../../public/static/icons/Plus.svg";
import PlusFilled from "../../public/static/icons/PlusFilled.svg";
import Link from "../../public/static/icons/Link.svg";
import Search from "../../public/static/icons/Search.svg";
import ChevronDown from "../../public/static/icons/ChevronDown.svg";
import ChevronLeft from "../../public/static/icons/ChevronLeft.svg";
import ChevronRight from "../../public/static/icons/ChevronRight.svg";
import Send from "../../public/static/icons/Send.svg";
import AddCompany from "../../public/static/icons/AddCompany.svg";
import SmileyFace from "../../public/static/icons/SmileyFace.svg";
import Film from "../../public/static/icons/Film.svg";
import File from "../../public/static/icons/File.svg";
import ArrowRight from "../../public/static/icons/ArrowRight.svg";
import Calendar from "../../public/static/icons/Calendar.svg";
import Info from "../../public/static/icons/Info.svg";
import InfoFilled from "../../public/static/icons/InfoFilled.svg";
import Lock from "../../public/static/icons/Lock.svg";

import { IPossibleIconValues } from "../../@types/Icons";

interface Props {
  icon: IPossibleIconValues;
  height?: number;
  width?: number;
  className?: string;
}

const IconUtil = ({ icon, height = 18, width = 18, className }: Props) => {
  const showActionIcon = useCallback(() => {
    switch (icon) {
      case "restore":
        return <Restore width={width} height={height} className={className} />;
      case "edit":
        return <Edit width={width} height={height} className={className} />;
      case "pause":
        return <Pause width={width} height={height} className={className} />;
      case "note":
        return <Note width={width} height={height} className={className} />;
      case "key":
        return <Key width={width} height={height} className={className} />;
      case "trash":
        return <Trash width={width} height={height} className={className} />;
      case "message":
        return <Message width={width} height={height} className={className} />;
      case "people":
        return <People width={width} height={height} className={className} />;
      case "video":
        return <Video width={width} height={height} className={className} />;
      case "videoPlus":
        return (
          <VideoPlus width={width} height={height} className={className} />
        );
      case "mute":
        return <BellOff width={width} height={height} className={className} />;
      case "unmute":
        return <Bell width={width} height={height} className={className} />;
      case "flag":
        return <Flag width={width} height={height} className={className} />;
      case "settings":
        return <Settings width={width} height={height} className={className} />;
      case "peoplePlus":
        return (
          <PeoplePlus width={width} height={height} className={className} />
        );
      case "schedule":
        return (
          <ScheduleSession
            width={width}
            height={height}
            className={className}
          />
        );
      case "editTopic":
        return (
          <EditTopic width={width} height={height} className={className} />
        );
      case "viewTopic":
        return (
          <ViewTopic width={width} height={height} className={className} />
        );
      case "crown":
        return <Crown width={width} height={height} className={className} />;
      case "messageEdit":
        return (
          <MessageEdit width={width} height={height} className={className} />
        );
      case "groupMemberChatEdit":
        return (
          <GroupMemberChatEdit
            width={width}
            height={height}
            className={className}
          />
        );
      case "searchChat":
        return (
          <SearchChat width={width} height={height} className={className} />
        );
      case "search":
        return <Search width={width} height={height} className={className} />;
      case "folder":
        return <Folder width={width} height={height} className={className} />;
      case "chevronDown":
        return (
          <ChevronDown width={width} height={height} className={className} />
        );
      case "chevronLeft":
        return (
          <ChevronLeft width={width} height={height} className={className} />
        );
      case "chevronRight":
        return (
          <ChevronRight width={width} height={height} className={className} />
        );
      case "link":
        return <Link width={width} height={height} className={className} />;
      case "minus":
        return <Minus width={width} height={height} className={className} />;
      case "plus":
        return <Plus width={width} height={height} className={className} />;
      case "plusFilled":
        return (
          <PlusFilled width={width} height={height} className={className} />
        );
      case "send":
        return <Send width={width} height={height} className={className} />;
      case "addCompany":
        return (
          <AddCompany width={width} height={height} className={className} />
        );
      case "smileyFace":
        return (
          <SmileyFace width={width} height={height} className={className} />
        );
      case "film":
        return <Film width={width} height={height} className={className} />;
      case "file":
        return <File width={width} height={height} className={className} />;
      case "arrowRight":
        return (
          <ArrowRight width={width} height={height} className={className} />
        );
      case "calendar":
        return <Calendar width={width} height={height} className={className} />;
      case "info":
        return <Info width={width} height={height} className={className} />;
      case "infoFilled":
        return (
          <InfoFilled width={width} height={height} className={className} />
        );
      case "lock":
        return <Lock width={width} height={height} className={className} />;
      default:
        return null;
    }
  }, [className, icon, width, height]);

  const actionIcon = showActionIcon();

  return <>{actionIcon}</>;
};

export default IconUtil;
