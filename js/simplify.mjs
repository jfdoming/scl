export const simplify = (tree) => {
	for (let i = 0; i < tree.length; ++i) {
		const node = tree[i];
		if (typeof node !== "object") continue;
		const keys = Object.keys(node);
		outer: for (const key of keys) {
			switch (key) {
				case "OPEN_PARENTHESIS":
				case "CLOSE_PARENTHESIS":
				case "COMMA":
				case "TERMINATOR":
					tree.splice(i, 1);
					--i;
					break outer;
				case "ARG_LIST":
					tree.splice(i, 1, ...simplify(node[key]));
					--i;
					break outer;
				case "EXPRESSION":
					const last = node[key][node[key].length - 1];
					if (Object.keys(last)[0] === "BARE_EXPRESSION") {
						const bExpr = last["BARE_EXPRESSION"];
						if (bExpr.length) {
							tree.splice(i, 1, {"OP_EXPRESSION": [{"EXPRESSION": node[key].slice(0, -1)}, ...simplify(bExpr)]});
							--i;
							break outer;
						} else {
							node[key].splice(node[key].length - 1);
						}
					}
					node[key] = simplify(node[key]);
					break;
				case "BARE_EXPR":
					if (!node[key].length) {
						tree.splice(i, 1);
						--i;
						break outer;
					}
					break;
				case "PROGRAM":
				case "PROGRAM_NEXT":
					tree.splice(i, 1, ...simplify(node[key]));
					--i;
					break outer;
				default:
					node[key] = simplify(node[key]);
			}
		}
	}
	return tree;
};

export default simplify;
