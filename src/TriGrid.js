import React from 'react';
import './App.css';

class TriGrid extends React.Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.points = [];
        this.pivots = [];
        this.className = props.className;
        this.style = props.drawStyle;
        this.lastFrequency = this.style.frequency;
    }

    getGridPoints() {
        var frequency = parseFloat(this.style.frequency);
        let points = [];
        points[0] = [];
        points[0][0] = [];
        var newPoint = [0, 0];
        let row = 0;
        while (newPoint[1] < this.style.height) {
            let column = 0;
            let evenRow = row % 2 === 0;
            points[row] = [];
            newPoint = [evenRow ? column * frequency : (column - .5) * frequency, frequency * row * .866];
            while (newPoint[0] < this.style.width) {
                points[row][column] = newPoint;
                column++;
                newPoint = [evenRow ? column * frequency : (column - .5) * frequency, frequency * row * .866];
            }
            points[row][column] = newPoint;
            column = 0;
            row++;
        }
        return (points);
    }

    randomizeGridPoints(points, intensity) {
        var frequency = parseFloat(this.style.frequency);
        points.forEach(row => {
            row.forEach(point => {
                point[0] += (Math.random() * 2 - 1) * frequency * intensity;
                point[1] += (Math.random() * 2 - 1) * frequency * .866 * intensity;
            });
        });
        return (points);
    }

    determineColor(position) {
        let fadeStart = this.style.fadeStart;
        let fadeEnd = this.style.fadeEnd;
        let width = this.style.width;
        let hex = this.style.color;
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

    drawLine(ctx, startPoint, endPoint) {
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
        ctx.lineWidth = this.style.lineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.imageSmoothingEnabled = true;
        //ToDo: add gradient styles: none, radial, linear
        let gradient = ctx.createRadialGradient(
            this.style.fadeCenterX,
            this.style.fadeCenterY,
            this.style.fadeStart,
            this.style.fadeCenterX,
            this.style.fadeCenterY,
            this.style.fadeEnd);
        gradient.addColorStop(0, this.style.color);
        let hex = this.style.color;
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
        this.points = this.randomizeGridPoints(this.getGridPoints(), .3);
        this.drawGridPoints(ctx, this.points);
        ctx.restore();
    }

    componentDidUpdate() {
        var isActive = this.props.isActive;
        if (isActive) {
            const canvas = this.canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.save();
            ctx.clearRect(0, 0, this.style.width, this.style.height);

            if (this.style.frequency != this.lastFrequency) {
                this.points = this.randomizeGridPoints(this.getGridPoints(), .3);
                this.lastFrequency = this.style.frequency;
            }

            this.setDrawStyle(ctx);
            this.drawGridPoints(ctx, this.points);
            ctx.restore();
        }
    }

    render() {
        return (
            <canvas className={this.className} ref={this.canvasRef} width={this.style.width} height={this.style.height} />
        )
    }
}

export default TriGrid;