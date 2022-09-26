import { isProduction } from './env';
import init from './lib/wasm/rust/examples';

const PATH = isProduction ? '/examples_bg.wasm' : undefined;

const mem = new WebAssembly.Memory({
	initial: 17,
	shared: false
});

export const wasm = () => init(PATH, mem);
