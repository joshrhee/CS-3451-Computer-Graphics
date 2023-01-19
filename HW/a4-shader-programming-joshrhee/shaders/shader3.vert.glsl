// Automatically provided by three.js
//
// uniform mat4 modelMatrix;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat3 normalMatrix;
// uniform vec3 cameraPosition;
// uniform bool isOrthographic;
// attribute vec3 position;
// attribute vec3 normal;
// attribute vec2 uv;

// interpolate the normal and texture coordinates across the surface
varying vec3 v_normal;
varying vec2 v_texcoord;

uniform float u_time;

void main() {
    v_normal = mat3(normalMatrix) * normal;
    v_texcoord = uv;

    vec3 pos = position;

    float radius = 500.0;

    pos.x += cos(u_time) * radius;
    pos.y += sin(u_time) * radius;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 10.0 );
    
}