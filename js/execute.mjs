import {noops, useDefault, customHandlers} from "/js/control.mjs";

// Implementation code.
const handlers = {...customHandlers};
for (let key of useDefault) {
	handlers[key] = doExecute;
}

const executeStmt = (type, node, scope) => {
	if (noops.includes(type)) {
		return;
	}

	const handler = handlers[type];
	if (handler) {
		return handler(node, scope, doExecute);
	} else {
		console.error("Unknown node: " + type + " /", node);
	}
};

function doExecute(tree, scope) {
	const results = [];
	for (const node of tree) {
		const keys = Object.keys(node);
		for (const key of keys) {
			const result = executeStmt(key, node[key], scope);
			results.push(result);
		}
	}
	for (const result of results) {
		if (typeof result !== "undefined") {
			return result;
		}
	}
}

const getScope = (stdout = console.log) => {
	return {
		print: stdout,
		println: (...args) => stdout(...args, "\n"),
		sin: Math.sin,
		pi: Math.PI,
	};
};

export const execute = (tree, stdout) => doExecute(tree, getScope(stdout));

export default execute;
