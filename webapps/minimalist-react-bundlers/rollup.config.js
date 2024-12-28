import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import {uglify} from "rollup-plugin-uglify";
import commonjs from "rollup-plugin-commonjs";
import replace from "@rollup/plugin-replace";
import serve from "rollup-plugin-serve";
import filesize from "rollup-plugin-filesize";

const NODE_ENV = process.env.NODE_ENV || 'development'
export default {
    input: "oneliners.js",
    output: {
        file: "bundle/bundle.js",
        format: "cjs"
    },
    plugins: [
        replace({
            "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
            preventAssignment: true
        }),
        babel({
            exclude: "node_modules/**"
        }),
        resolve(),
        commonjs(),
        filesize(),
        NODE_ENV !== 'production' && serve({contentBase: ''}),
        NODE_ENV !== 'production' && livereload(),
        NODE_ENV === 'production' && uglify(),
    ]
}