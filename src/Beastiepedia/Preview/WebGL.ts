export class WebGLError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, WebGLError.prototype);
  }
}

export default function setupWebGL(
  canvas: HTMLCanvasElement,
  vertex: string,
  fragment: string,
) {
  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    throw new WebGLError("No WebGL.");
  }
  const program = createProgram(gl, vertex, fragment);

  createTexCoordAttribute(gl, program);
  createPositionAttribute(gl, program);

  createTexture(gl);

  gl.viewport(-1000, -1000, 2000, 2000);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  return { gl: gl, program: program };
}

export function setColorUniforms(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  colors: number[][],
) {
  for (let i = 0; i < (6 < colors.length ? 6 : colors.length); i++) {
    gl.uniform3fv(gl.getUniformLocation(program, `colorOut[${i}]`), colors[i]);
  }
  draw(gl);
}

function createTexture(gl: WebGLRenderingContext) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
}

export function setImage(gl: WebGLRenderingContext, image: HTMLImageElement) {
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  draw(gl);
}

function draw(gl: WebGLRenderingContext) {
  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 6;
  gl.drawArrays(primitiveType, offset, count);
}

function createPositionAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
) {
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const positionBuffer = gl.createBuffer();
  const positions = [-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  const size = 2; // 2 components per iteration
  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset,
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
}

function createTexCoordAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
) {
  const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
    ]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(texCoordLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  const size = 2; // 2 components per iteration
  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    texCoordLocation,
    size,
    type,
    normalize,
    stride,
    offset,
  );
}

function createProgram(
  gl: WebGLRenderingContext,
  vertex: string,
  fragment: string,
) {
  const vertex_shader = createShader(gl, gl.VERTEX_SHADER, vertex);
  const fragment_shader = createShader(gl, gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram();
  if (!program) {
    throw new WebGLError("Couldn't create program.");
  }
  gl.attachShader(program, vertex_shader);
  gl.attachShader(program, fragment_shader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    gl.deleteProgram(program);
    throw new WebGLError(
      `Program link failed. ${gl.getProgramInfoLog(program)}`,
    );
  }
  return program;
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new WebGLError("Couldn't create shader.");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    gl.deleteShader(shader);
    throw new WebGLError(
      `Shader compilation failed. ${gl.getShaderInfoLog(shader)}`,
    );
  }
  return shader;
}
