/**
 * @typedef {(Point2D|{x: (Number|null), y: (Number|null)}|Number[])} Point
 */

export class Point2D {
    #_x;
    #_y;

    get x() {
        return this.#_x
    }

    /**@param {Number}val*/
    set x(val) {
        if (typeof val == "number") this.#_x = val
        this.onChange(this);
        return this.#_x;
    }

    get y() {
        return this.#_y
    }

    /**@param {Number}val*/
    set y(val) {
        if (typeof val == "number") this.#_y = val
        this.onChange(this);
        return this.#_y;
    }

    onChange = () => {
    };

    /**
     * @return {Point} - is coordinate changed
     * @param points
     */
    add(...points) {
        points.forEach(point => {
            let { x, y } = Point2D.pure(point);
            this.x += (x || 0);
            this.y += (y || 0);
        })
        return this;
    }

    /**
     * @param {Point} point
     * @return {Point2D}
     */
    minus(point) {
        let { x, y } = Point2D.pure(point);
        this.x -= x;
        this.y -= y;
        return this;
    }

    /**
     * @param {Point} points
     * @return {Boolean}
     */
    equal(...points) {
        let isEqual = true;
        points.forEach((point, index) => {
            if (!isEqual || !points[index + 1]) return
            let p1 = Point2D.pure(points[index]),
                p2 = Point2D.pure(points[index + 1])
            isEqual = (p1.x === p2.x && p1.y === p2.y);
        })
        return isEqual;
    }

    /**
     * @param {Point|null} [point=[0,0]]
     * @param {Number} [e=3] - 精确度
     * @return {string} - distance
     */
    distTo(point = [0, 0], e = 3) {
        let { x, y } = Point2D.minus(Point2D.pure(this), Point2D.pure(point));
        return Math.sqrt(x * x + y * y).toFixed(e);
    }

    /**
     * @param {Point|null} point
     */
    set(point) {
        let { x, y } = Point2D.pure(point);
        this.x = x;
        this.y = y;
        return this;
    }

    toString() {
        return `(${this.x},${this.y})`;
    }

    static in(point, interval) {

    }

    /**
     * @param {Point} points
     * @return {Point2D}
     */
    static sum(...points) {
        let result = new Point2D();
        result.add(...points);
        return result;
    }

    /**
     * @param {Point} leftPoint
     * @param {Point} rightPoint
     * @return {Point2D} - distance
     */
    static minus(leftPoint, rightPoint) {
        return Point2D.new(leftPoint).minus(rightPoint);
    }

    /**
     * @param {Point} points
     * @return {Boolean}
     */
    static equal(...points) {
        return Point2D.new(points[0]).equal(...points);
    }

    /**
     * @param {Point} leftPoint
     * @param {Point} [rightPoint=[0,0]]
     * @param {Number} [e=3] - 精确度
     * @return {string} - distance
     */
    static distance(leftPoint, rightPoint = [0, 0], e = 3) {
        let { x, y } = Point2D.minus(leftPoint, rightPoint);
        return Math.sqrt(x * x + y * y).toFixed(e);
    }

    /**
     * @param [point = null]
     * @return {Point2D}
     */
    static new = (point = null) => new Point2D(point);

    /**
     * @param {Point|null} [point = [0,0]]
     * @returns {{x: (Number|null), y: (Number|null)}}
     */
    static pure(point) {
        point = point || [null, null];
        let p = { x: null, y: null };
        if (point.x === 0 || point[0] === 0) p.x = 0
        else p.x = point.x || point[0] || null
        if (point.y === 0 || point[1] === 0) p.y = 0
        else p.y = point.y || point[1] || null
        return p;
    }

    /**
     * @param {Point|null} [point = null]
     * @param onChange
     */
    constructor(point = null, onChange = () => {
    }) {
        this.set(point);
        this.onChange = onChange;
    }
}

export class Interval2D {
    /**
     * @type Point2D
     */
    #_ul;
    get ul() {
        return this.#_ul;
    }

    /**
     * @param point {Point}
     */
    set ul(point) {
        this.#_ul.set(point);
        this.onChange(this);
    }

    #_lr;

    get lr() {
        return this.#_lr;
    }

    /**
     * @param point
     */
    set lr(point) {
        this.#_lr.set(point);
        this.onChange(this);
    }

    config = {
        limit: null,
        bind: null,
        onChange: () => {
        }
    }

    onChange(interval) {
        this.config.onChange(this)
    };

    in(interval) {
        let ul = Point2D.minus(this.ul, interval.ul)
        let lr = Point2D.minus(interval.lr, this.lr)
        return !(ul.x < 0 || ul.y < 0 || lr.x < 0 || lr.y < 0);
    }

    static in(checkedInterval, limitInterval) {
        let ul = Point2D.minus(checkedInterval.ul, limitInterval.ul)
        let lr = Point2D.minus(limitInterval.lr, checkedInterval.lr)
        return !(ul.x < 0 || ul.y < 0 || lr.x < 0 || lr.y < 0);
    }

    /**
     * @param {Point} point
     * @description ul平移至point
     * @return {Interval2D}
     */
    translate(point) {
        let ul = point
        let lr = Point2D.minus(this.lr, this.ul).add(point)
        this.set({ ul, lr })
        this.onChange(this)
        return this;
    }

    /**
     *
     * @param interval2D.ul {Point}
     * @param interval2D.lr {Point}
     * @return {Interval2D}
     */
    set(interval2D) {
        this.ul = interval2D.ul;
        this.lr = interval2D.lr;
        return this;
    }

    toOffset() {
        let { ul, lr } = this
        return {
            left: ul.x,
            top: ul.y,
            width: lr.x - ul.x,
            height: lr.y - ul.y,
        }
    }

    toString() {
        return (
            `${this.ul.toString()} (${this.lr.x},${this.ul.y}) \n(${this.ul.x},${this.lr.y}) ${this.lr.toString()}`);
    }

    static toInterval2D(element) {
        let clientRect = element.getBoundingClientRect()
        return new Interval2D({
            ul: {
                x: element.offsetLeft,
                y: element.offsetTop,
            },
            lr: {
                x: clientRect.left + clientRect.width,
                y: clientRect.top + clientRect.height,
            }
        })
    }

    static pure(interval) {
        return {
            ul: Point2D.pure(interval.ul),
            lr: Point2D.pure(interval.lr)
        }
    }

    constructor(interval2D, config) {
        let { ul, lr } = interval2D || [null, null];
        this.#_ul = new Point2D(ul);
        this.#_lr = new Point2D(lr);
        this.set({ ul, lr });
        Object.assign(this.config, config)
    }
}