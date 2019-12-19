import React from 'react';
import './App.css';
import TriGrid from './TriGrid.js';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { HuePicker } from 'react-color';

class TransformableTriGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active: true };
        this.drawStyle = props.drawStyle;
        this.className = props.className;
        this.updateAnimationState = this.updateAnimationState.bind(this);
        this.red = parseInt(this.drawStyle.color.slice(1, 3), 16);
        this.green = parseInt(this.drawStyle.color.slice(3, 5), 16);
        this.blue = parseInt(this.drawStyle.color.slice(5, 7), 16);
    }

    componentDidMount() {
        this.rAF = requestAnimationFrame(this.updateAnimationState);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rAF);
    }

    updateAnimationState() {
        this.setState(prevState => ({ active: prevState.active }));
        this.rAF = requestAnimationFrame(this.updateAnimationState);
    }

    handleFrequency(event) {
        this.drawStyle.frequency = event.target.value;
    }
    handleLineWidth(event) {
        this.drawStyle.lineWidth = event.target.value;
    }
    handleCenterX(event) {
        this.drawStyle.fadeCenterX = event.target.value;
    }
    handleCenterY(event) {
        this.drawStyle.fadeCenterY = event.target.value;
    }
    handleStart(event) {
        this.drawStyle.fadeStart = event.target.value;
    }
    handleEnd(event) {
        this.drawStyle.fadeEnd = event.target.value;
    }
    handleColor() {
        this.drawStyle.color = '#' + this.toHex(this.red) + this.toHex(this.green) + this.toHex(this.blue);
    }
    toHex(value) {
        let num = Number(value);
        if (num < 16) {
            return ("0" + num.toString(16));
        }
        return num.toString(16);
    }
    handleRed(event) {
        this.red = event.target.value;
        this.handleColor();
    }
    handleGreen(event) {
        this.green = event.target.value;
        this.handleColor();
    }
    handleBlue(event) {
        this.blue = event.target.value;
        this.handleColor();
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col><h1> Tri-Mesh Demo </h1></Col>
                </Row>
                <br />
                <Row>
                    <Col md="12" lg="7" xl="6" >
                        <TriGrid
                            className={this.className}
                            isActive={this.state.active}
                            drawStyle={this.drawStyle} />
                    </Col>
                    <Col md="12" lg="5" >

                        <div className="Controls">
                            <div className="sliderContainer">
                                <h3> Style </h3>
                                Frequency
                                <input type="range" min="16" max="128" value={this.drawStyle.frequency} className="slider" onChange={this.handleFrequency.bind(this)} />

                                Line Width
                                <input type="range" min="0" max="16" value={this.drawStyle.lineWidth} className="slider" onChange={this.handleLineWidth.bind(this)} />

                                Fade Centerpoint X
                                <input type="range" min="0" max="512" value={this.drawStyle.fadeCenterX} className="slider" onChange={this.handleCenterX.bind(this)} />

                                Fade Centerpoint Y
                                <input type="range" min="0" max="512" value={this.drawStyle.fadeCenterY} className="slider" onChange={this.handleCenterY.bind(this)} />

                                Fade Interior Radius
                                <input type="range" min="0" max="725" value={this.drawStyle.fadeStart} className="slider" onChange={this.handleStart.bind(this)} />

                                Fade Exterior Radius
                                <input type="range" min="0" max="725" value={this.drawStyle.fadeEnd} className="slider" onChange={this.handleEnd.bind(this)} />
                            </div>
                            <div>
                                <h3>Color</h3>
                                Red
                                <input type="range" min="0" max="255" value={this.red} className="slider" onChange={this.handleRed.bind(this)} />
                                Green
                                <input type="range" min="0" max="255" value={this.green} className="slider" onChange={this.handleGreen.bind(this)} />
                                Blue
                                <input type="range" min="0" max="255" value={this.blue} className="slider" onChange={this.handleBlue.bind(this)} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>);
    }
}

export default TransformableTriGrid;