import React, {Component} from 'react';
import { fromTo } from 'gsap';
//import Draggable from 'gsap/src/uncompressed/utils/Draggable';
import Draggable, {DraggableCore} from 'react-draggable';
import { Button, Row, Col } from '../../generic';
import './style.scss';


function newPoints(pos, parent) {
  var x = 0; // your center point
  var y = 0; // your center point
  var radius = parent.clientWidth / 2;
  var scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)); // distance formula ratio
  if (scale < 1) {
    return {
      y: Math.round((pos.y - y) * scale + y),
      x: Math.round((pos.x - x) * scale + x)
    };
  } else {
    return pos;
  }
}

function distance(points1 = {x: 0, y:0}, points2){
  return Math.sqrt(Math.pow(points2.x-points1.x,2)+Math.pow(points2.y-points1.y,2));
}

const IndicatorCircle = (props) => {
 return  (
  <Col className="col-sm-4">
  <div className="indicatorContainer">
  <div className="spacer"></div>
  <div className="rotationIndicator yaw">
  <div className="pointer required" style={{transform: `rotate(${props.required || 0}deg)`}}></div>
  <div className="pointer current" style={{transform: `rotate(${props.current || 0}deg)`}}></div>
  <span className="label up">0</span>
  <span className="label right">90</span>
  <span className="label down">180</span>
  <span className="label left">270</span>
  </div>
  </div>
  <label>{props.name}</label>
  </Col>
  );
};

class Thrusters extends Component {
 constructor(props){
  super(props);
  this.state = {
   control: false,
   gamepad: null,
   lastTimeMsec: null,
   request: null,
   activeDrags: 0,
   deltaPosition: {
    x: 0, y: 0
  },
  dragging: {
    left: 0, top: 0
  }
};
}
componentWillUnmount() {
  cancelAnimationFrame(this.state.request);
}
	/*componentDidMount(){
		let self = this;
		this.setState({
			request: requestAnimationFrame(this.tick.bind(this))
		});
		Draggable.create(this.refs.directionDragger,{
			type: "x,y",
			edgeResistance: 0.95,
			onDragStart: function(){
				self.setState({
					dragging:true
				})
			},
			onDrag: function () {
				let parent = this.target.parentElement;
				let pos = {
					x:this.x,
					y:this.y
				};
				let newPos = newPoints(pos, parent);
				let transformSet = 'translate3d(' + newPos.x + 'px, ' + newPos.y + 'px, 0px)';
				this.target.style.transform = transformSet;

            	//Now to calculate the magnitude
            	let magnitude = {x:(newPos.x / (parent.clientWidth / 2)),y:(newPos.y / ( parent.clientHeight / 2))};
            	this.newPos = newPos;
            	if (self.props.data && magnitude){
            		let obj = {
            			direction:{
            				x: magnitude.x,
            				y: magnitude.y,
            				z: self.props.data.thrusters.direction.z,
            			}
            		};
            		//self.props.operationChannel.push("update",{table:"systems",filter:{simulatorId:self.props.params.simulatorId,name:'Thrusters'},data:obj});
            	}
            },
            onDragEnd: function () {
            	var joystick = self.refs.directionDragger;
            	fromTo(joystick, 0.1, {
            		transform: `translate3d(${this.newPos.x}px,${this.newPos.y}px,0px)`
            	},{
            		transform: 'translate3d(0px,0px,0px)'
            	});
            	if (self.props.data){
            		let obj = {
            			direction:{
            				x: 0,
            				y: 0,
            				z: self.props.data.thrusters.direction.z,
            			}
            		};
            		//self.props.operationChannel.push("update",{table:"systems",filter:{simulatorId:self.props.params.simulatorId,name:'Thrusters'},data:obj});
            	}
            	self.setState({
            		dragging:false
            	})
            }
        });
		Draggable.create(this.refs.rotationDragger,{
			type: "x,y",
			edgeResistance: 0.95,
			onDragStart: function(){
				self.setState({
					dragging:true
				})
			},
			onDrag: function () {
				let parent = this.target.parentElement;
				let pos = {
					x:this.x,
					y:this.y
				};
				let newPos = newPoints(pos, parent);
				let transformSet = 'translate3d(' + newPos.x + 'px, ' + newPos.y + 'px, 0px)';
				this.target.style.transform = transformSet;

            	//Now to calculate the magnitude
            	let magnitude = {x:(newPos.x / (parent.clientWidth / 2)),y:(newPos.y / ( parent.clientHeight / 2))};
            	this.newPos = newPos;
            	if (self.props.data && magnitude){
            		let obj = {
            			attitudeAdjust:{
            				roll: magnitude.x,
            				pitch: magnitude.y,
            				yaw: self.props.data.thrusters.attitudeAdjust.yaw,
            			}
            		};
            		//self.props.operationChannel.push("update",{table:"systems",filter:{simulatorId:self.props.params.simulatorId,name:'Thrusters'},data:obj});
            	}
            },
            onDragEnd: function () {
            	var joystick = self.refs.rotationDragger;
            	fromTo(joystick, 0.1, {
            		transform: `translate3d(${this.newPos.x}px,${this.newPos.y}px,0px)`
            	},{
            		transform: 'translate3d(0px,0px,0px)'
            	});
            	if (self.props.data){
            		let obj = {
            			attitudeAdjust:{
            				roll: 0,
            				pitch: 0,
            				yaw: self.props.data.thrusters.attitudeAdjust.yaw,
            			}
            		};
            		//self.props.operationChannel.push("update",{table:"systems",filter:{simulatorId:self.props.params.simulatorId,name:'Thrusters'},data:obj});
            	}
            	self.setState({
            		dragging:false
            	})
            }
        });
		Draggable.create(this.refs.foreDragger,{
			type: "x",
			bounds: this.refs.foreDragger.parentElement,
			edgeResistance: 0.95,
			onDragStart: function(){
				self.setState({
					dragging:true
				})
			},
			onDrag: function () {
				let parent = this.target.parentElement;
				let pos = {
					x:this.x,
					y:this.y
				};

            	//Now to calculate the magnitude
            	let magnitude = {x:(pos.x / (parent.clientWidth / 2)),y:(pos.y / ( parent.clientHeight / 2))};
            	if (self.props.data && magnitude){
            		let obj = {
            			direction:{
            				x: self.props.data.thrusters.direction.x,
            				y: self.props.data.thrusters.direction.y,
            				z: magnitude.x,
            			}
            		};
            		//self.props.operationChannel.push("update",{table:"systems",filter:{simulatorId:self.props.params.simulatorId,name:'Thrusters'},data:obj});
            	}
            	this.newPos = pos;
            },
            onDragEnd: function () {
            	var joystick = self.refs.foreDragger;
            	fromTo(joystick, 0.1, {
            		transform: `translate3d(${this.newPos.x}px,${this.newPos.y}px,0px)`
            	},{
            		transform: 'translate3d(0px,0px,0px)'
            	});
            	if (self.props.data){
            		let obj = {
            			direction:{
            				x: self.props.data.thrusters.direction.x,
            				y: self.props.data.thrusters.direction.y,
            				z: 0,
            			}
            		};
            		//self.props.operationChannel.push("update",{table:"systems",filter:{simulatorId:self.props.params.simulatorId,name:'Thrusters'},data:obj});
            	}
            	self.setState({
            		dragging:false
            	})
            }
        });
		Draggable.create(this.refs.yawDragger,{
			type: "x",
			bounds: this.refs.yawDragger.parentElement,
			edgeResistance: 0.95,
			onDragStart: function(){
				self.setState({
					dragging:true
				})
			},
			onDrag: function () {
				let parent = this.target.parentElement;
				let pos = {
					x:this.x,
					y:this.y
				};

            	//Now to calculate the magnitude
            	let magnitude = {x:(pos.x / (parent.clientWidth / 2)),y:(pos.y / ( parent.clientHeight / 2))};
            	if (self.props.data && magnitude){
            		let obj = {
            			attitudeAdjust:{
            				roll: self.props.data.thrusters.attitudeAdjust.roll,
            				pitch: self.props.data.thrusters.attitudeAdjust.pitch,
            				yaw: magnitude.x,
            			}
            		};
            		//self.props.operationChannel.push("update",{table:"systems",filter:{simulatorId:self.props.params.simulatorId,name:'Thrusters'},data:obj});
            	}
            	this.newPos = pos;
            },
            onDragEnd: function () {
            	var joystick = self.refs.yawDragger;
            	fromTo(joystick, 0.1, {
            		transform: `translate3d(${this.newPos.x}px,${this.newPos.y}px,0px)`
            	},{
            		transform: 'translate3d(0px,0px,0px)'
            	});
            	if (self.props.data){
            		let obj = {
            			attitudeAdjust:{
            				roll: self.props.data.thrusters.attitudeAdjust.roll,
            				pitch: self.props.data.thrusters.attitudeAdjust.pitch,
            				yaw: 0,
            			}
            		};
            		//self.props.operationChannel.push("update",{table:"systems",filter:{simulatorId:self.props.params.simulatorId,name:'Thrusters'},data:obj});
            	}
            	self.setState({
            		dragging:false
            	})
            }
        });
      }*/
      tick() {
        this.gamepadLoop();
        this.setState({
         lastTimeMsec: Date.now(),
         request: requestAnimationFrame(this.tick.bind(this))
       });
      }
      gamepadLoop(){
        const gamepad = navigator.getGamepads()[0];
        if (gamepad && this.state.control){
			//Create a custom object to store.
			let direction = {x:0,y:0,z:0};
			switch(Math.round(gamepad.axes[9] * 100) / 100) {
				case -1:
				direction.y = 1;
				break;
				case -0.71:
				direction.y = 0.7;
				direction.x = 0.7;
				break;
				case -0.43:
				direction.x = 1;
				break;
				case -0.14:
				direction.y = -0.7;
				direction.x = 0.7;
				break;
				case 0.14:
				direction.y = -1;
				break;
				case 0.43:
				direction.y = -0.7;
				direction.x = -0.7;
				break;
				case 0.71:
				direction.x = -1;
				break;
				case 1:
				direction.x = -0.7;
				direction.y = 0.7;
				break;
				default:
				break;
			}
			direction.z = Math.round((gamepad.axes[2]) * -10) / 10;
			const obj = {
				attitudeAdjust:{
					roll:Math.round(gamepad.axes[0] * 100) / 100,
					pitch: Math.round(gamepad.axes[1] * 100) / 100,
					yaw: 0,
				},
				direction: direction,
			};
			const gamepadObj = this.state.gamepad;
			if (JSON.stringify(gamepadObj) !== JSON.stringify(obj)){
				//this.props.operationChannel.push("update",{table:"systems",filter:{simulatorId:this.props.params.simulatorId,name:'Thrusters'},data:obj});
				this.setState({
					gamepad:obj,
				});
			}
		}
	}
	gamepadControl(){
		//Disable/enable the draggables
		/*if (!this.state.control){
			Draggable.get(this.refs.directionDragger).disable();
			Draggable.get(this.refs.rotationDragger).disable();
			Draggable.get(this.refs.foreDragger).disable();
			Draggable.get(this.refs.yawDragger).disable();
		} else {
			Draggable.get(this.refs.directionDragger).enable();
			Draggable.get(this.refs.rotationDragger).enable();
			Draggable.get(this.refs.foreDragger).enable();
			Draggable.get(this.refs.yawDragger).enable();
		}*/
		this.setState({control:!this.state.control});
	}
  onDragHandler(handlerName:string) {
    return (e, {node, deltaX, deltaY}) => {
      const self = this;
      const newPosition = {top: 0, left: 0};
      // Get new XY
      const parentRect = node.offsetParent.getBoundingClientRect();
      const clientRect = node.getBoundingClientRect();
      switch (handlerName) {
        case 'onDragStart':
        this.setState({dragging: newPosition});
        break;
        case 'onDrag':
        if (!this.state.dragging) throw new Error('onDrag called before onDragStart.');
        const { width } = node.offsetParent.getBoundingClientRect();
        newPosition.left = (parentRect.left + parentRect.width/2 - e.clientX) / width * -1 * 2;
        newPosition.top = (parentRect.top + parentRect.height/2 - e.clientY) / width * -1 * 2;
        if (distance(undefined, {x: newPosition.left, y: newPosition.top}) > 1){
          const theta = Math.abs(Math.atan(newPosition.top/newPosition.left));
          if (newPosition.left > 0){
            newPosition.left = Math.cos(theta);
          } else {
            newPosition.left = Math.cos(theta) * -1;
          }
          if (newPosition.top > 0){
            newPosition.top  = Math.sin(theta);
          } else {
            newPosition.top  = Math.sin(theta) * -1;
          }
        }
        this.setState({dragging: newPosition});
        break;
        case 'onDragStop':
        if (!this.state.dragging) throw new Error('onDragEnd called before onDragStart.');
        newPosition.left = this.state.dragging.left;
        newPosition.top = this.state.dragging.top;
        fromTo(this.state.dragging, 0.1, this.state.dragging, {
          left: 0, top: 0, 
          onUpdate:function() {self.setState({dragging: {left:this.target.left, top: this.target.top}});}
        });
        break;
        default:
        throw new Error('onDragHandler called with unrecognized handlerName: ' + handlerName);
      }
    };
  }
  render(){
    let { width, height } = {width: 0, height: 0};
    if (this.refs.dirCirc){
      width = this.refs.dirCirc.getBoundingClientRect().width;
      height = this.refs.dirCirc.getBoundingClientRect().height;
    }
    return (
     <div className="cardThrusters">
     <Row>
     <Col className="col-sm-3 draggerContainer">
     <label>Direction</label>
     <div className="spacer"></div>
     <div className="draggerCircle" ref="dirCirc">
     <DraggableCore
     onStart={this.onDragHandler('onDragStart')}
     onDrag={this.onDragHandler('onDrag')}
     onStop={this.onDragHandler('onDragStop')}
     >
     <div ref="directionDragger" className="dragger direction alertBack" style={{transform:`translate3d(${this.state.dragging.left * width / 2}px,${this.state.dragging.top * height / 2}px,0px)`}}></div>
     </DraggableCore>
     <span className="label up">Up</span>
     <span className="label right">Starboard</span>
     <span className="label down">Down</span>
     <span className="label left">Port</span>
     </div>
     <div className="draggerBar">
       {/*
       <div ref="foreDragger" className="dragger fore alertBack" style={{transform:`translate3d(${fore}px,0px,0px)`}}></div>
     */}
     <span className="label right">Forward</span>
     <span className="label left">Reverse</span>
     </div>
     </Col>
     <Col className="col-sm-6">
     <Row>
     <div style={{marginTop: '60%'}}></div>
     </Row>
     <Row>
     {
       /*}
       <IndicatorCircle name={`Yaw: ${Math.round(yawRot)}`} required={yawReq} current={yawRot} />
       <IndicatorCircle name={`Pitch: ${Math.round(pitchRot)}`} required={pitchReq} current={pitchRot} />
       <IndicatorCircle name={`Roll: ${Math.round(rollRot)}`} required={rollReq} current={rollRot} />
       */
     }
     </Row>
     {/*gamepad ? <Row>
      <Col className="col-sm-6 col-sm-offset-3">
      <Button type="primary" className="btn-block" onClick={this.gamepadControl.bind(this)} label={`${(this.state.control ? "Deactivate" : "Activate")} Manual Control`} />
      </Col>
      </Row> : <div></div>
    */}
    </Col>
    <Col className="col-sm-3 draggerContainer">
    <label>Rotation</label>
    <div className="spacer"></div>
    <div className="draggerCircle">
    {/*
    <div ref="rotationDragger" className="dragger rotation alertBack" style={{transform:`translate3d(${roll}px,${pitch}px,0px)`}}></div>
  */}
  <span className="label up">Pitch Up</span>
  <span className="label right">Roll Right</span>
  <span className="label down">Pitch Down</span>
  <span className="label left">Roll Left</span>
  </div>
  <div className="draggerBar">
  <div ref="yawDragger" className="dragger yaw alertBack"></div>
  <span className="label right">Yaw Starboard</span>
  <span className="label left">Yaw Port</span>
  </div>
  </Col>
  </Row>
  </div>
  );
  }
}

export default Thrusters;
