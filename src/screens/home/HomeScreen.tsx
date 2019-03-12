import {
  Body,
  Button,
  Container,
  H1,
  Header,
  Left,
  ListItem,
  NativeBase,
  Right,
  Text,
  Title
} from "native-base";
import * as React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Accelerometer, Constants } from "expo";
import Icon from "../../components/Icon";
import NavigationComponent from "../../components/NavigationComponent";
import { folderListItem, FolderListType } from "../../pages/FolderList";
import {
  folderListActions,
  folderListState
} from "../../pages/FolderList/folderListStore";
import { AppState } from "../../store/store";
import WatchItem, { State } from "../stopwatch/WatchItem";
import { watchActions, watchState } from "../stopwatch/watchStore";
import { any } from "prop-types";

type Props = {
  time: number;
  items: folderListState;
  watches: watchState;
};

export default connect((store: AppState) => {
  return {
    time: store.time,
    items: store.folderList,
    watches: store.stopwatch
  } as Props;
})(
  class HomeScreen extends NavigationComponent<Props> {
    isSensorSubscribed = false;
    homeWatch = any;

    state = {
      accelerometerData: {
        x: {},
        y: {},
        z: {}
      }
    };

    _slow = () => {
      Accelerometer.setUpdateInterval(1000);
    };

    _fast = () => {
      Accelerometer.setUpdateInterval(16);
    };

    _subscribe = () => {
      if (!this.isSensorSubscribed) {
        Accelerometer.addListener(accelerometerData => {
          this.setState({ accelerometerData });
        });
        this.isSensorSubscribed = true;
      }
    };

    public componentDidMount(): void {
      this.createStopWatch("HomeWatch", "Movement");
      this.createStopWatch("NorthWatch", "North");
      this.createStopWatch("EastWatch", "East");
      this.createStopWatch("SouthWatch", "South");
      this.createStopWatch("WestWatch", "West");
    }

    /**
     * Creates a new stopwatch if it doesn't exist.
     * @param id
     * @param name
     */
    private createStopWatch(id: string, name: string) {
      if (!this.props.items[id]) {
        this.props.dispatch(
          folderListActions.saveItem(id, {
            type: FolderListType.Item,
            parent: null,
            name,
            value: 0
          })
        );
        this.props.dispatch(
          watchActions.saveWatch(id, {
            state: State.OFF,
            startTime: 0,
            savedTime: 0,
            laps: []
          })
        );
      }
    }

    /**
     * Delete stopwatch.
     * @param id
     */
    private deleteStopWatch(id: string) {
      this.props.dispatch(folderListActions.deleteItem(id));
      this.props.dispatch(watchActions.deleteWatch(id));
    }

    _toggle = () => {
      this._subscribe();
    };

    render() {
      let { x, y, z } = this.state.accelerometerData;
      this._subscribe();

      // if (x > 1.5 || x < -1.5 || y > 1.5 || y < -1.5 || z > 1.5 || z < -1.5) {
      //   // var homeWatch = new WatchItem(this.props.items["HomeWatch"]);
      //   // homeWatch.rightAction();
      //   console.log("movement detected");
      // }

      if (!this.props.items["HomeWatch"]) return null;
      if (!this.props.items["NorthWatch"]) return null;
      if (!this.props.items["EastWatch"]) return null;
      if (!this.props.items["SouthWatch"]) return null;
      if (!this.props.items["WestWatch"]) return null;

      return (
        <Container>
          {this.header()}
          {this.renderItem(this.props.items["HomeWatch"])}
          {this.renderCircle(this.props.items["NorthWatch"])}
          {this.renderCircle(this.props.items["EastWatch"])}
          {this.renderCircle(this.props.items["SouthWatch"])}
          {this.renderCircle(this.props.items["WestWatch"])}
        </Container>
      );
    }

    private header() {
      return (
        <Header>
          <Left />
          <Body>
            <Title>Header</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.openSettings}>
              <Icon name="settings" />
            </Button>
          </Right>
        </Header>
      );
    }
    private openSettings = () => {
      this.props.navigation.navigate("Settings");
    };

    private renderCircle = (item: folderListItem) => {
      var currentWatch = new WatchItem(item);

      if (currentWatch.item.name == "North") {
        return (
          <Body style={{ marginTop: 0, position: "absolute", top: 160 }}>
            {this.circle(currentWatch)}
          </Body>
        );
      } else if (currentWatch.item.name == "South") {
        return (
          <Body style={{ marginTop: 0, position: "absolute", top: 460 }}>
            {this.circle(currentWatch)}
          </Body>
        );
      } else if (currentWatch.item.name == "East") {
        return (
          <Body
            style={{ marginTop: 0, position: "absolute", top: 305, right: 70 }}
          >
            {this.circle(currentWatch)}
          </Body>
        );
      } else if (currentWatch.item.name == "West") {
        return (
          <Body
            style={{ marginTop: 0, position: "absolute", top: 305, left: 50 }}
          >
            {this.circle(currentWatch)}
          </Body>
        );
      }
    };
    protected circle(stopwatch: WatchItem) {
      return (
        <>
          <H1 numberOfLines={1}>{stopwatch.item.name}</H1>
          <Text>{stopwatch.timeString(this.props.time)}</Text>

          <Right style={{ position: "absolute", left: -20, top: 60 }}>
            {this.circleButton(
              {
                [[undefined, "dark", "danger"][stopwatch.data.state]]: true,

                disabled: stopwatch.data.state === State.OFF,
                onPress: () => stopwatch.leftAction()
              },
              ["repeat", "repeat", "square"][stopwatch.data.state]
            )}
          </Right>
          <Right style={{ position: "absolute", left: 45, top: 60 }}>
            {this.circleButton(
              {
                [["success", "warning", "success"][stopwatch.data.state]]: true,

                onPress: () => stopwatch.rightAction()
              },
              ["play", "pause", "play"][stopwatch.data.state]
            )}
          </Right>
        </>
      );
    }

    private renderItem = (item: folderListItem) => {
      return (
        <ListItem
          button
          style={innerStyle.listItem}
          onPress={() => {
            this.props.navigation.navigate("WatchDetails", {
              itemId: item.id
            });
          }}
        >
          {this.item(new WatchItem(item))}
        </ListItem>
      );
    };
    protected item(stopwatch: WatchItem) {
      if (stopwatch.item.name == "Movement") {
        let { x, y, z } = this.state.accelerometerData;
        if (x > 1.5 || x < -1.5 || y > 1.5 || y < -1.5 || z > 1.5 || z < -1.5) {
          stopwatch.movementOn();
        } else {
          stopwatch.movementOff();
        }
      }
      return (
        <>
          <Body style={innerStyle.center}>
            <H1 numberOfLines={1}>{stopwatch.item.name}</H1>
            <Text>Time: {stopwatch.timeString(this.props.time)}</Text>
            <Text>Lap: {stopwatch.toString(stopwatch.lapDiff[0])}</Text>
          </Body>
          <Right style={innerStyle.right}>
            {this.circleButton(
              {
                [[undefined, "dark", "danger"][stopwatch.data.state]]: true,

                disabled: stopwatch.data.state === State.OFF,
                onPress: () => stopwatch.leftAction()
              },
              ["repeat", "repeat", "square"][stopwatch.data.state]
            )}
            {this.circleButton(
              {
                [["success", "warning", "success"][stopwatch.data.state]]: true,

                onPress: () => stopwatch.rightAction()
              },
              ["play", "pause", "play"][stopwatch.data.state]
            )}
          </Right>
        </>
      );
    }

    protected circleButton(props: NativeBase.Button, name: string) {
      return (
        <Button style={innerStyle.circular} {...props}>
          <Icon name={name} />
        </Button>
      );
    }
  }
);

const circleSize = 52;
const innerStyle = StyleSheet.create({
  listItem: { height: 72, marginLeft: 0 },
  body: { flex: 7 },
  center: { flex: 4 },
  right: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  circular: {
    justifyContent: "center",
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2
  }
});

const compassStyle = StyleSheet.create({
  listItem: { height: 72, marginLeft: 0 },
  body: {},
  center: {},
  right: {
    marginRight: 200,
    marginTop: 20
  },
  circular: {
    justifyContent: "center",
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2
  }
});
