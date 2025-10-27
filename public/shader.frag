precision highp float;
varying vec2 v_uv;

#define PI 3.14159265

uniform float u_time;
uniform vec2 u_resolution;

vec2 getCenterSquareResolution(in vec2 uv) {
    vec2 st = uv / u_resolution;
    st = (st - 0.5) * 2.0;
    float aspect = u_resolution.x / u_resolution.y;
    if (aspect > 1.0) { st.x *= aspect; } 
    else { st.y /= aspect; }
    return st * 0.5 + 0.5;
}

const float sides = 6.;
const vec3 u_firstColor = vec3(.2, 0., 0.);
const vec3 u_secondColor = vec3(.25, 0., 0.);

mat2 rotate2d(in float a) { 
    return mat2(cos(a), -sin(a), sin(a), cos(a));
}

void main() {
    vec2 st = getCenterSquareResolution(v_uv * u_resolution);
    st -= vec2(0.5, .0);
    st = rotate2d(u_time) * st;
    vec3 color = vec3(0);

    float a1 = atan(st.y, st.x) / PI / 2.;
    float twoSides = fract(a1*sides/2.);
    color = twoSides < .5 ? u_firstColor : u_secondColor;
    
    gl_FragColor = vec4(color ,1.0);
}