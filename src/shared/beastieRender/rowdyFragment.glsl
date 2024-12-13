precision mediump float;
 
const int max_colors = 6;
const vec3 color_tolorance = vec3(0.0833,0.99,0.99);

// our texture
uniform sampler2D u_image;
uniform vec3 colorOut[max_colors];
uniform int colorCount;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
 
vec3 rgb_to_hsv( vec3 c ) {
    vec4 K = vec4( 0., -1./3., 2./3., -1. );
    vec4 p = (c.g < c.b)? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
    vec4 q = (c.r < p.x)? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
    float chroma = q.x - min(q.w, q.y);
    if ( chroma == 0. ) //max = min (no saturation)
    {
        return vec3( 0., 0., q.x );
    }
    else if ( q.x == 0. ) //max = 0 (black)
    {
        return vec3( 0. );
    }
    else //Normal output, without div-by-zero errors! \o/
    {
        return vec3( abs( q.z + (q.w - q.y)/(6.*chroma) ), chroma/q.x, q.x );
    }
}

vec3 hsv_to_rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec4 initialColor = texture2D(u_image, v_texCoord);
    if (initialColor.a == 0.0) {
        gl_FragColor = vec4(0, 0, 0, 0);
        return;
    }
    vec3 color = initialColor.rgb;
    vec3 colorIn[max_colors];
    colorIn[0] = vec3(0.0, 1.0, 1.0);
    colorIn[1] = vec3(0.33, 1.0, 1.0);
    colorIn[2] = vec3(0.66, 1.0, 1.0);
    colorIn[3] = vec3(0.166, 1.0, 1.0);
    colorIn[4] = vec3(0.5, 1.0, 1.0);
    colorIn[5] = vec3(0.833, 1.0, 1.0);
    vec3 colorHSV = rgb_to_hsv(color);
    if (color.r==0.0 && color.g==0.0 && color.b==0.0) {
      gl_FragColor = vec4(mix(vec3(0.329, 0.015, 0.098), vec3(0.412, 0.0, 0.106), 0.5 + (0.5*sin(0.0))), 1); 
    } else {
      for (int i=0; i < max_colors; i+=1) {
          if (i >= colorCount) {break;}
          vec3 colorDelta = colorHSV - colorIn[i];
          if (abs(colorDelta.r) > 0.5) colorDelta.r -= sign(colorDelta.r);
          if (
              abs(colorDelta.r) <= color_tolorance.r && 
              abs(colorDelta.g) <= color_tolorance.g &&
              abs(colorDelta.b) <= color_tolorance.b
          ) {
              vec3 colorOutHSV = rgb_to_hsv(colorOut[i]);
              colorOutHSV.r = (floor(colorOutHSV.r + 0.5) + colorOutHSV.r) * 0.5; //redden 
              colorOutHSV.g = colorOutHSV.g * 0.5; //desaturate 
              colorOutHSV.b = (1.0 + colorOutHSV.b) * 0.5; //lighten 
              color = hsv_to_rgb(vec3(
                  mod(colorOutHSV.r + colorDelta.r, 1.0),
                  clamp(colorOutHSV.g + colorDelta.g, 0.0, 1.0),
                  clamp(colorOutHSV.b + colorDelta.b, 0.0, 1.0)
              ));
          }
      }
      gl_FragColor =  vec4(color, initialColor.a);
  }
}
