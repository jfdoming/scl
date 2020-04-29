export const noops = ["TERMINATOR", "OPEN_PARENTHESIS", "CLOSE_PARENTHESIS", "PROGRAM_END", "COMMA", "COMMENT"];
export const useDefault = ["PROGRAM", "PROGRAM_NEXT", "ARG_LIST"];
export const customHandlers = {
	"STATEMENT": (node, scope, execute) => {
		const result = execute(node, scope);
		if (typeof result !== "undefined") {
			console.log("Result: " + result);
		}
	},
	"EXPRESSION_1": (node, scope, execute) => {
		if (node.length < 2) {
			return execute([node[0]], scope);
		}

		let operator = Object.keys(node[1]["OPERATOR_1"][0])[0];
		let lhs = execute([node[0]], scope);
		let rhs = execute([node[2]], scope);
		switch (operator) {
			case "PLUS":
				return lhs + rhs;
			case "MINUS":
				return lhs - rhs;
			default:
				return;
		}
	},
	"EXPRESSION_2": (node, scope, execute) => {
		if (node.length < 2) {
			return execute([node[0]], scope);
		}
		
		let operator = Object.keys(node[1]["OPERATOR_2"][0])[0];
		let lhs = execute([node[0]], scope);
		let rhs = execute([node[2]], scope);
		switch (operator) {
			case "MULTIPLY":
				return lhs * rhs;
			case "DIVIDE":
				return lhs / rhs;
			default:
				return;
		}
	},
	"EXPRESSION_3": (node, scope, execute) => {
		if (node.length < 2) {
			return execute([node[0]], scope);
		}
		
		let operator = Object.keys(node[1]["OPERATOR_3"][0])[0];
		let lhs = execute([node[0]], scope);
		let rhs = execute([node[2]], scope);
		switch (operator) {
			case "POWER":
				return lhs ** rhs;
			default:
				return;
		}
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
	"FACTOR": (node, scope, execute) => {
		let type = Object.keys(node[0])[0];
		if (type == "MINUS") return -execute([node[1]], scope);
		if (type == "OPEN_PARENTHESIS") return execute([node[1]], scope);
		return execute([node[0]], scope);
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

