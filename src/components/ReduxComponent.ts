import * as React from 'react';
import { DispatchProp } from 'react-redux';

export default class ReduxComponent<T = {}> extends React.PureComponent<DispatchProp & T> {
}
