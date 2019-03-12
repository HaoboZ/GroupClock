import moment from "moment-timezone";
import { folderListItem } from "../../pages/FolderList";
import store from "../../store/store";
import { power } from "../home/settings/settingsStore";
import { watchActions } from "./watchStore";

export enum State {
  OFF,
  ON,
  PAUSED
}

export type watchItemData = {
  id: string;
  state: State;
  startTime: number;
  savedTime: number;
  laps: number[];
};

export default class WatchItem {
  item: folderListItem;
  data: watchItemData;

  static create(id: string, itemData: watchItemData) {
    itemData = Object.assign(
      {
        state: State.OFF,
        startTime: 0,
        savedTime: 0,
        laps: []
      },
      itemData
    );
    store.dispatch(watchActions.saveWatch(id, itemData));
    return this;
  }

  constructor(item: folderListItem) {
    this.item = item;
    this.data = store.getState().stopwatch[item.id];
  }

  public timeString(time: number) {
    return this.data.state === State.ON
      ? this.toString(time - this.data.startTime, false)
      : this.toString(this.data.savedTime);
  }

  public get lapDiff() {
    const lapDiff = [];
    for (let i = 0; i < this.data.laps.length; ++i)
      lapDiff[i] = this.data.laps[i] - (this.data.laps[i + 1] || 0);
    return lapDiff;
  }

  public async leftAction() {
    switch (this.data.state) {
      case State.OFF:
        return;
      case State.ON:
        this.data.laps.unshift(Date.now() - this.data.startTime);
        break;
      case State.PAUSED:
        Object.assign(this.data, {
          state: State.OFF,
          startTime: 0,
          savedTime: 0,
          laps: []
        });
        break;
    }
    store.dispatch(watchActions.saveWatch(this.data.id, this.data));
  }
  public async rightAction() {
    switch (this.data.state) {
      case State.OFF:
        Object.assign(this.data, {
          state: State.ON,
          startTime: Date.now()
        });
        break;
      case State.ON:
        Object.assign(this.data, {
          state: State.PAUSED,
          startTime: 0,
          savedTime: Date.now() - this.data.startTime
        });
        break;
      case State.PAUSED:
        Object.assign(this.data, {
          state: State.ON,
          startTime: Date.now() - this.data.savedTime,
          savedTime: 0
        });
        break;
    }
    store.dispatch(watchActions.saveWatch(this.data.id, this.data));
  }

  public async movementOn() {
    switch (this.data.state) {
      case State.OFF:
        Object.assign(this.data, {
          state: State.ON,
          startTime: Date.now()
        });
        break;
      case State.ON:
        break;
      case State.PAUSED:
        Object.assign(this.data, {
          state: State.ON,
          startTime: Date.now() - this.data.savedTime,
          savedTime: 0
        });
        break;
    }
  }

  public async movementOff() {
    switch (this.data.state) {
      case State.OFF:
        break;
      case State.ON:
        Object.assign(this.data, {
          state: State.PAUSED,
          startTime: 0,
          savedTime: Date.now() - this.data.startTime
        });
        break;
      case State.PAUSED:
    }
  }

  public delete() {
    store.dispatch(watchActions.deleteWatch(this.data.id));
  }

  public toString(time: number, accurate: boolean = true) {
    const duration = moment.duration(Math.max(0, time));
    if (accurate || store.getState().settings.precision !== power.low)
      return duration.format("h:mm:ss.SS", { stopTrim: "m" });
    else return duration.format("h:mm:ss", { stopTrim: "m" });
  }
}
