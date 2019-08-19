export const noops = ["TERMINATOR", "OPEN_PARENTHESIS", "CLOSE_PARENTHESIS", "PROGRAM_END", "COMMA", "COMMENT"];
export const useDefault = ["PROGRAM", "PROGRAM_NEXT", "TERM", "ARG_LIST"];
export const customHandlers = {
	"STATEMENT": (node, scope, execute) => {
		const result = execute(node, scope);
		if (typeof result !== "undefined") {
			console.log("Result: " + result);
		}
	},
	"EXPRESSION": (node, scope, execute) => {
		let bareExpr = null;
		let realNode = node;
		if (node.length && (bareExpr = node[node.length - 1]["BARE_EXPRESSION"])) {
			if (bareExpr.length) {
				realNode = [{
					"OP_EXPRESSION": [
						{"EXPRESSION": node.slice(0, -1)},
						bareExpr[0],
						bareExpr[1]
					],
				}];
			} else {
				realNode = realNode.slice(0, -1);
			}
		}
		return execute(realNode, scope);
	},
	"FUNCTION": (node, scope = {}, execute) => {
		const identifier = node[0]["IDENTIFIER"][1];
		if (!(identifier in scope)) {
			throw {
				source: "parser",
				message: ["Cannot find definition for function \"" + identifier + "\"."],
			};
		}

		const args = [];
		for (let i = 1; i < node.length; ++i) {
			args.push(execute([node[i]], scope));
		}

		return scope[identifier](...args);
	},
	"OP_EXPRESSION": (node, scope, execute) => {
		let operator = Object.keys(node[1]["OPERATOR"][0])[0];
		let lhs = execute([node[0]], scope);
		let rhs = execute([node[2]], scope);
		switch (operator) {
			case "PLUS":
				return lhs + rhs;
			case "MINUS":
				return lhs - rhs;
			case "MULTIPLY":
				return lhs * rhs;
			case "DIVIDE":
				return lhs / rhs;
			default:
				return;
		}
	},
	"NUMBER": (node) => +node[1],
	"STRING": (node) => node[1].substring(1, node[1].length - 1),
	"IDENTIFIER": (node, scope) => {
		const identifier = node[1];
		if (!(identifier in scope)) {
			throw {
				source: "parser",
				message: [
					"Cannot find definition for identifier \"" + identifier + "\".",
				],
			};
		}

		return scope[identifier];
	},
};

