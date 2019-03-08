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
import { StyleSheet } from "react-native";
import { connect } from "react-redux";
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

    render() {
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
      return <ListItem>{this.circle(new WatchItem(item))}</ListItem>;
    };
    protected circle(stopwatch: WatchItem) {
      return (
        <>
          <Body style={compassStyle.center}>
            <H1 numberOfLines={1}>{stopwatch.item.name}</H1>
            <Text>{stopwatch.timeString(this.props.time)}</Text>
          </Body>
          <Right style={compassStyle.right}>
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
    marginRight: 200
  },
  circular: {
    justifyContent: "center",
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2
  }
});
