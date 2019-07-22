const screen = document.querySelector('.screen');
const cCxt = screen.getContext("2d");
const Near = 0.1;
const Far = 1000;
const Fov = 90;
const AspectRatio = screen.height / screen.width;
const FovRad = 1 / Math.tan(Fov * 0.5 / 180 * Math.PI);
let Theta = 0;

function Vec3D(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
}
function Triangle(X,Y,Z) {
    this.p3D = [];
    for (let i=0; i<3; i++) {
        this.p3D.push(new Vec3D(X[i],Y[i],Z[i]));
    }
}
function Matrix4x4() {
    this.m4x4 = [];
    for (let i=0; i<4; i++) {
        this.m4x4[i] = [];
        for (let j=0; j<4; j++) {
            this.m4x4[i][j] = 0;
        }
    }
}
function ProjectionMatrix() {
    let mtrxProj = new Matrix4x4();
    mtrxProj.m4x4[0][0] = AspectRatio * FovRad;
    mtrxProj.m4x4[1][1] = FovRad;
    mtrxProj.m4x4[2][2] = Far / (Far - Near);
    mtrxProj.m4x4[3][2] = -(Far * Near) / (Far - Near);
    mtrxProj.m4x4[2][3] = 1;
    mtrxProj.m4x4[3][3] = 0;
    return mtrxProj;
}
function Cube() {
    this.cMesh = [
        // SOUTH
        new Triangle([0, 0, 0],  [0, 1, 0],  [1, 1, 0]),
        new Triangle([0, 0, 0],  [1, 1, 0],  [1, 0, 0]),
        // EAST
        new Triangle([1, 0, 0],  [1, 1, 0],  [1, 1, 1]),
        new Triangle([1, 0, 0],  [1, 1, 1],  [1, 0, 1]),
        // NORTH
        new Triangle([1, 0, 1],  [1, 1, 1],  [0, 1, 1]),
        new Triangle([1, 0, 1],  [0, 1, 1],  [0, 0, 1]),
        // WEST
        new Triangle([0, 0, 1],  [0, 1, 1],  [0, 1, 0]),
        new Triangle([0, 0, 1],  [0, 1, 0],  [0, 0, 0]),
        // TOP
        new Triangle([0, 1, 0],  [0, 1, 1],  [1, 1, 1]),
        new Triangle([0, 1, 0],  [1, 1, 1],  [1, 1, 0]),
        // BOTTOM
        new Triangle([1, 0, 1],  [0, 0, 1],  [0, 0, 0]),
        new Triangle([1, 0, 1],  [0, 0, 0],  [1, 0, 0]),
    ];
}
function MatrixVectorMulti(v, o, mtrxProj) {
    o.x = v.x * mtrxProj.m4x4[0][0] + v.y * mtrxProj.m4x4[1][0] + v.z * mtrxProj.m4x4[2][0] + mtrxProj.m4x4[3][0];
    o.y = v.x * mtrxProj.m4x4[0][1] + v.y * mtrxProj.m4x4[1][1] + v.z * mtrxProj.m4x4[2][1] + mtrxProj.m4x4[3][1];
    o.z = v.x * mtrxProj.m4x4[0][2] + v.y * mtrxProj.m4x4[1][2] + v.z * mtrxProj.m4x4[2][2] + mtrxProj.m4x4[3][2];
    let w = v.x * mtrxProj.m4x4[0][3] + v.y * mtrxProj.m4x4[1][3] + v.z * mtrxProj.m4x4[2][3] + mtrxProj.m4x4[3][3];
    if (w != 0) {
        o.x /= w; o.y /= w; o.z /= w;
    }
}
function main() {
    const martxproj = ProjectionMatrix();
    let tempCubeMesh = new Cube();

    for (let tri of tempCubeMesh.cMesh) {

        let triProjected = new Triangle([0,0,0],[0,0,0],[0,0,0]);

        tri.p3D[0].z += 2;
        tri.p3D[1].z += 2;
        tri.p3D[2].z += 2;

        MatrixVectorMulti(tri.p3D[0], triProjected.p3D[0], martxproj);
        MatrixVectorMulti(tri.p3D[1], triProjected.p3D[1], martxproj);
        MatrixVectorMulti(tri.p3D[2], triProjected.p3D[2], martxproj);

        triProjected.p3D[0].x += 1; triProjected.p3D[0].y += 1;
        triProjected.p3D[1].x += 1; triProjected.p3D[1].y += 1;
        triProjected.p3D[2].x += 1; triProjected.p3D[2].y += 1;

        triProjected.p3D[0].x *= 0.5 * screen.width;
        triProjected.p3D[0].y *= 0.5 * screen.height;
        triProjected.p3D[1].x *= 0.5 * screen.width;
        triProjected.p3D[1].y *= 0.5 * screen.height;
        triProjected.p3D[2].x *= 0.5 * screen.width;
        triProjected.p3D[2].y *= 0.5 * screen.height;

        drawTriangle(triProjected.p3D[0].x,triProjected.p3D[0].y,
                    triProjected.p3D[1].x,triProjected.p3D[1].y,
                    triProjected.p3D[2].x,triProjected.p3D[2].y);
    }
}

function drawTriangle(x1,y1, x2,y2, x3,y3) {
    cCxt.strokeStyle = "white";
    cCxt.beginPath();
    drawLine(x1,y1,x2,y2);
    drawLine(x2,y2,x3,y3);
    drawLine(x3,y3,x1,y1);
}

function drawLine(fx,fy,tx,ty) {
    cCxt.moveTo(fx,fy);
    cCxt.lineTo(tx,ty);
    cCxt.stroke();
}

main();