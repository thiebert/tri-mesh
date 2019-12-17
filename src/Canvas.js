import React from 'react';
import './App.css';
import { bool } from 'prop-types';

class Canvas extends React.Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    getGridPoints() {
        var frequency = parseFloat(this.props.frequency);
        let points = [];
        points[0] = [];
        points[0][0] = [];
        var newPoint = [0, 0];
        let row = 0;
        while (newPoint[1] < this.props.height) {
            let column = 0;
            let evenRow = row % 2 === 0;
            points[row] = [];
            newPoint = [evenRow ? column * frequency : (column - .5) * frequency, frequency * row * .866];
            while (newPoint[0] < this.props.width) {
                points[row][column] = newPoint;
                column++;
                newPoint = [evenRow ? column * frequency : (column - .5) * frequency, frequency * row * .866];
            }
            points[row][column] = newPoint;
            column = 0;
            row++;
        }
        console.log(points);
        return (points);
    }

    randomizeGridPoints(points) {
        var frequency = parseFloat(this.props.frequency);
        points.forEach(row => {
            row.forEach(point => {
                point[0] += (Math.random() * 2 - 1) * frequency * .3;
                point[1] += (Math.random() * 2 - 1) * frequency * .866 * .3;
            });
        });
        return (points);
    }

    determineColor(position) {
        let fadeStart = this.props.fadeStart;
        let fadeEnd = this.props.fadeEnd;
        let width = this.props.width;
        let hex = this.props.color;
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        var distance = Math.sqrt((width - position[0]) * (width - position[0]) + Math.abs(position[1]) * Math.abs(position[1]));
        let alpha = 0;
        if (distance < fadeStart) {
            alpha = 1;
        }
        else if (distance > fadeEnd) {
            alpha = 0;
        }
        else {
            alpha = 1 - (distance - fadeStart) / (fadeEnd - fadeStart);
        }
        return ('rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')');
    }

    determineGradient(ctx, start, end) {
        var startColor = this.determineColor(start);
        var endColor = this.determineColor(end);
        var gradient = ctx.createLinearGradient(start[0], start[1], end[0], end[1]);
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        return (gradient);
    }

    drawLine(ctx, startPoint, endPoint) {
        // ctx.strokeStyle = this.determineGradient(ctx, startPoint, endPoint);
        ctx.lineTo(endPoint[0], endPoint[1]);
        ctx.stroke();
        ctx.moveTo(startPoint[0], startPoint[1]);
    }

    drawGridPoints(ctx, points) {
        for (let row = 0; row < points.length; row++) {
            for (let column = 0; column < points[row].length; column++) {
                ctx.beginPath();
                var startPoint = points[row][column];
                var endPoint;
                ctx.moveTo(startPoint[0], startPoint[1]);
                if (column + 1 < points[row].length) {
                    endPoint = points[row][column + 1];
                    this.drawLine(ctx, startPoint, endPoint);
                }
                if (row + 1 < points.length) {
                    if (column < points[row + 1].length) {
                        endPoint = points[row + 1][column];
                        this.drawLine(ctx, startPoint, endPoint);
                    }
                    if (row % 2 === 0) {
                        if (column + 1 < points[row + 1].length) {
                            endPoint = points[row + 1][column + 1];
                            this.drawLine(ctx, startPoint, endPoint);
                        }
                    } else {
                        if (column > 0) {
                            endPoint = points[row + 1][column - 1];
                            this.drawLine(ctx, startPoint, endPoint);
                        }
                    }
                }

            }
        }
    }

    setDrawStyle(ctx) {
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.imageSmoothingEnabled = true;
        let gradient = ctx.createRadialGradient(this.props.width, 0, this.props.fadeStart, this.props.width, 0, this.props.fadeEnd);
        gradient.addColorStop(0, this.props.color);
        let hex = this.props.color;
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        gradient.addColorStop(1, 'rgba(' + r + ', ' + g + ', ' + b + ', 0)');

        ctx.strokeStyle = gradient;
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.save();
        this.setDrawStyle(ctx);
        let points = this.getGridPoints();
        this.drawGridPoints(ctx, this.randomizeGridPoints(points));
        ctx.restore();
    }

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef} width={this.props.width} height={this.props.height} />
            </div>
        )
    }
}

export default Canvas;