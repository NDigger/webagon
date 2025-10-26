export default class FragmentShader {
    #gl;
    #program;

    constructor(canvasId, frag) {
        const canvas = document.getElementById(canvasId);
        const gl = canvas.getContext("webgl");

        const getShader = (type, src) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
            }
            return shader;
        }

        const vs = getShader(gl.VERTEX_SHADER, `
                attribute vec2 a_position;
                varying vec2 v_uv;
                void main() {
                    v_uv = (a_position + 1.0) * 0.5;
                    gl_Position = vec4(a_position, 0.0, 1.0);
                }
            `)
        const fs = getShader(gl.FRAGMENT_SHADER, frag);

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        // Fullscreen Rect
        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1,  1, 1, -1, 1, 1]);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const pos = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        this.#gl = gl;
        this.#program = program;

        requestAnimationFrame(() => this.#update())
    }

    #update() {
        this.#gl.clearColor(0, 0, 0, 1);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
        this.#gl.drawArrays(this.#gl.TRIANGLES, 0, 6);
        requestAnimationFrame(() => this.#update());
    }

    setUniform(uniformName, params) {
        const uniform = this.#gl.getUniformLocation(this.#program, uniformName);
        if (params.length === 1) this.#gl.uniform1f(uniform, params[0]);
        else if (params.length === 2) this.#gl.uniform2f(uniform, params[0], params[1]);
        else if (params.length === 3) this.#gl.uniform3f(uniform, params[0], params[1], params[2]);
        else if (params.length === 4) this.#gl.uniform4f(uniform, params[0], params[1], params[2], params[3]);
    }
}