import React, {Component, Fragment} from "react";
import {Row, Col, Card} from "helpers/reactstrap";
import {Mutation} from "react-apollo";
import gql from "graphql-tag.macro";
import {keys} from "../../../components/views/Widgets/keyboard";
import EventPicker from "../MissionConfig/EventPicker";
import MacroConfig from "./macroConfig";
import EventName from "containers/FlightDirector/MissionConfig/EventName";
import {FaBan} from "react-icons/fa";

const Key = ({
  label,
  name,
  modifier,
  escape,
  size,
  shifting,
  enter,
  shift,
  short,
  blank,
  char,
  selected,
  handleClick,
  keyCode,
}) => {
  return (
    <div
      className={`key ${size ? "size-" + size : ""} ${escape ? "escape" : ""} ${
        modifier ? "modifier" : ""
      } ${enter ? "enter" : ""} ${short ? "short" : ""} ${
        blank ? "blank" : ""
      } ${selected ? "selected" : ""}`}
      onClick={() => handleClick(name, keyCode)}
    >
      {label || (shifting ? shift : char) || name}
    </div>
  );
};

const UPDATE_KEY = gql`
  mutation UpdateKey(
    $id: ID!
    $key: String!
    $keyCode: String!
    $meta: [String]!
    $actions: [ActionInput]!
  ) {
    updateKeyboardKey(
      id: $id
      key: {key: $key, keyCode: $keyCode, meta: $meta, actions: $actions}
    )
  }
`;

class KeyboardControl extends Component {
  state = {
    selectedKey: null,
    meta: [],
  };
  handleMeta = (which, key) => {
    const {meta} = this.state;

    if (key?.indexOf(which) > -1) {
      if (meta.indexOf(which) > -1) {
        this.setState({meta: meta.filter(m => m !== which)});
      } else {
        this.setState({meta: meta.concat(which)});
      }
      return true;
    }
  };
  handleClick = (key, keyCode) => {
    const {selectedKey, selectedKeyCode} = this.state;
    const tf =
      this.handleMeta("command", key) ||
      this.handleMeta("shift", key) ||
      this.handleMeta("option", key) ||
      this.handleMeta("control", key);
    if (!tf) {
      this.setState({
        selectedKey: selectedKey === key ? null : key,
        selectedKeyCode: selectedKeyCode === keyCode ? null : keyCode,
      });
    }
  };
  getKey = () => {
    const {
      keyboard: {keys: keyboardKeys},
    } = this.props;
    const {selectedKey, selectedKeyCode, meta} = this.state;
    const key =
      keyboardKeys.find(
        k =>
          (k.keyCode === selectedKeyCode || k.key === selectedKey) &&
          JSON.stringify(k.meta.sort()) === JSON.stringify(meta.sort()),
      ) || {};
    return key;
  };
  addAction = (e, updateKey) => {
    const {
      keyboard: {id},
    } = this.props;
    const {selectedKey, selectedKeyCode, meta} = this.state;
    const key = this.getKey();
    const {actions = []} = key;
    const event = e.target.value;
    updateKey({
      variables: {
        id,
        key: selectedKey || selectedKeyCode,
        keyCode: selectedKeyCode,
        meta,
        actions: actions.map(({__typename, ...rest}) => rest).concat({event}),
      },
    });
  };
  removeAction = (action, updateKey) => {
    const {
      keyboard: {id},
    } = this.props;
    const {selectedKey, selectedKeyCode, meta} = this.state;
    const key = this.getKey();
    const {actions = []} = key;
    updateKey({
      variables: {
        id,
        key: selectedKey || selectedKeyCode,
        keyCode: selectedKeyCode,
        meta,
        actions: actions
          .map(({__typename, ...rest}) => rest)
          .filter(a => a.id !== action),
      },
    });
  };
  updateAction = (action, updateKey) => {
    const {
      keyboard: {id},
    } = this.props;
    const {selectedKey, selectedKeyCode, meta} = this.state;
    const key = this.getKey();
    const {actions = []} = key;
    updateKey({
      variables: {
        id,
        key: selectedKey || selectedKeyCode,
        keyCode: selectedKeyCode,
        meta,
        actions: actions
          .map(a => {
            let returnVal = a;
            if (a.id === action.id) returnVal = action;
            const {__typename, ...rest} = returnVal;
            return rest;
          })
          .filter(a => a.id !== action),
      },
    });
  };
  render() {
    const {selectedKeyCode, meta, selectedAction} = this.state;
    const selectedKeyObj = this.getKey();
    return (
      <Fragment>
        <Row>
          <Col sm={12}>
            {" "}
            <div className="keyboard keyboard-ex">
              {keys.map((k, i) => (
                <Key
                  key={k.keyCode || k.name || i}
                  {...k}
                  handleClick={this.handleClick}
                  selected={
                    k.keyCode === selectedKeyCode ||
                    meta.indexOf(k.name?.slice(1, Infinity)) > -1
                  }
                  showEx
                />
              ))}
            </div>
          </Col>
        </Row>
        {selectedKeyCode && (
          <Mutation mutation={UPDATE_KEY}>
            {updateKey => (
              <Fragment>
                <h4>
                  Selected Key: {meta.concat(selectedKeyCode).join(" + ")}
                </h4>

                <Row>
                  <Col sm={6}>
                    <Card className="scroll">
                      {selectedKeyObj &&
                        (selectedKeyObj.actions || []).map(e => {
                          return (
                            <li
                              key={e.id}
                              onClick={() =>
                                this.setState({selectedAction: e.id})
                              }
                              className={`${
                                e.id === selectedAction ? "selected" : ""
                              } list-group-item`}
                            >
                              <EventName id={e.event} label={e.event} />{" "}
                              <FaBan
                                className="text-danger pull-right"
                                onClick={() =>
                                  this.removeAction(e.id, updateKey)
                                }
                              />
                            </li>
                          );
                        })}

                      <EventPicker
                        className={"btn btn-sm btn-success"}
                        handleChange={e => this.addAction(e, updateKey)}
                      />
                    </Card>
                  </Col>
                  <Col sm={6} style={{maxHeight: "40vh", overflowY: "auto"}}>
                    <MacroConfig
                      key={selectedAction}
                      selectedAction={selectedAction}
                      selectedKey={selectedKeyObj}
                      updateAction={action =>
                        this.updateAction(action, updateKey)
                      }
                    />
                  </Col>
                </Row>
              </Fragment>
            )}
          </Mutation>
        )}
      </Fragment>
    );
  }
}
export default KeyboardControl;
