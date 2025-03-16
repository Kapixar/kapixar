/*
    * Generates a blob shape using SVG path data.
*/

const getBlobSvg = ({ size = 400, growth = 6, edges = 6, seed = null, color="#932d18" } = {}) => {
    const { destPoints } = _createPoints(size, growth, edges, seed);
    const path = _createSvgPath(destPoints);
    const svgString = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <path d="${path}" fill="${color}" /></svg>`;

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    return svgDoc.documentElement;
};

const getLiquidBlobSvg = ({ size = 400, growth = 6, edges = 6, seed = null, color="#932d18" } = {}) => {
    const { destPoints: dp1 } = _createPoints(size, growth, edges, seed);
    const path = _createSvgPath(dp1);
    
    const { destPoints: dp2 } = _createPoints(size, growth, edges, seed);
    const path2 = _createSvgPath(dp2);

    const { destPoints: dp3 } = _createPoints(size, growth, edges, seed);
    const path3 = _createSvgPath(dp3);

    const { destPoints: dp4 } = _createPoints(size, growth, edges, seed);
    const path4 = _createSvgPath(dp4);

    const svgString = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="meet xMidYMid ">
    <filter id="gooeyBlobz">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix in="blur" mode="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 20 -10" />
    </filter>
    <path filter="#gooeyBlobz" d="${path}">
        <animate attributeName="d" 
            values="${path};${path2};${path3};${path4};${path}" 
            dur="25s" 
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;0.25;0.5;0.75;1"
            keySplines="0.25 0.1 0.25 1; 0.42 0 0.58 1; 0.25 0.1 0.25 1; 0.42 0 0.58 1" />
    </path>
    </svg>`;
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    return svgDoc.documentElement;
};


const _toRad = (deg) => deg * (Math.PI / 180.0);

const _divide = (count) => {
    const deg = 360 / count;

    return Array(count)
        .fill("a")
        .map((_, i) => i * deg);
};

const _randomDoubleGenerator = (s) => {
    var mask = 0xffffffff;
    var m_w = (123456789 + s) & mask;
    var m_z = (987654321 - s) & mask;

    return function () {
        m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

        var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
        result /= 4294967296;
        return result;
    };
};

const _magicPoint = (value, min, max) => {
    let radius = min + value * (max - min);
    if (radius > max) {
        radius = radius - min;
    } else if (radius < min) {
        radius = radius + min;
    }
    return radius;
};

const _point = (origin, radius, degree) => {
    var x = origin + radius * Math.cos(_toRad(degree));
    var y = origin + radius * Math.sin(_toRad(degree));
    return [Math.round(x), Math.round(y)];
};

const _shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
    return array;
};

const _createPoints = (size, minGrowth, edgesCount, seed) => {
    let outerRad = size / 2;
    let innerRad = minGrowth * (outerRad / 10);
    let center = size / 2;

    let slices = _divide(edgesCount);
    let maxRandomValue = _shuffle([99, 999, 9999, 99999, 999999])[0];
    let id = Math.floor(Math.random() * maxRandomValue);
    let seedValue = seed || id;
    let randVal = _randomDoubleGenerator(seedValue);
    let destPoints = [];

    slices.forEach((degree) => {
        let O = _magicPoint(randVal(), innerRad, outerRad);
        let end = _point(center, O, degree);
        destPoints.push(end);
    });
    return { destPoints, seedValue };
};

const _createSvgPath = (points) => {
    let svgPath = "";
    var mid = [
        (points[0][0] + points[1][0]) / 2,
        (points[0][1] + points[1][1]) / 2,
    ];
    svgPath += "M" + mid[0] + "," + mid[1];

    for (var i = 0; i < points.length; i++) {
        var p1 = points[(i + 1) % points.length];
        var p2 = points[(i + 2) % points.length];
        mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
        svgPath += "Q" + p1[0] + "," + p1[1] + "," + mid[0] + "," + mid[1];
    }
    svgPath += "Z";
    return svgPath;
};
