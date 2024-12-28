import { makeAutoObservable, runInAction } from "mobx";
import { IRoom } from "ms-npm/meet-models";

export default class MeetStore {
  constructor() {
    makeAutoObservable(this);
  }

  roomId: string = null;
  room: IRoom = null;
  roomName: string = "Instant Meeting";
  channelRef: string = null;

  setRoomId = (id: string) => {
    this.roomId = id;
  };

  setRoom = (room: IRoom) => {
    this.room = room;
  };

  setChannelRef = (id: string) => {
    this.channelRef = id;
  };
}
