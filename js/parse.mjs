import {TOKENS} from "/js/tokenize.mjs";
import {GRAMMAR} from "/js/grammar.mjs";

const matchesRule = (tokens, rule, quiet) => {
	if (!GRAMMAR[rule]) {
		return false;
	}

	const out = (quiet ? () => {} : console.log);
	
	let newIndex = 0;
	let newTree = null;
	for (const subRule of GRAMMAR[rule]) {
		if (typeof subRule === "undefined") {
			continue;
		}

		out("Rule[" + rule + "]:", subRule.join(" "));
		
		let index = 0;
		let tree = [];
		for (const item of subRule) {
			if (!tokens || index >= tokens.length) {
				tree = null;
				break;
			}
			
			out(tokens[index][0] + "[" + tokens[index][1] + "]", "?=", item);
			if (tokens[index][0] === item) {
				// We've matched a token.
				out(tokens[index][0] + "[" + tokens[index][1] + "]", "==", item);
				tree.push({[item]: tokens[index]});
				++index;
				continue;
			}
			
			const matches = matchesRule(tokens.slice(index), item, quiet);
			if (!matches[0]) {
				out(tokens[index][0] + "[" + tokens[index][1] + "]", "!=", item);
				tree = null;
				break;
			}
			out(tokens[index][0] + "[" + tokens[index][1] + "]", "==", item);
			tree.push({[item]: matches[0]});
			index += matches[1];
		}
		
		if (tree) {
			newTree = tree;
			newIndex = index;
			break;
		}
	}
	return [newTree, newIndex];
};

export const parse = (tokens, quiet = true) => {
	if (!tokens || !tokens.length) {
		console.log("No tokens provided.");
		return {};
	}
	const [result] = matchesRule(tokens, "PROGRAM", quiet);
	if (!result) {
		throw {
			source: "parser",
			message: ["Failed to parse program.\n"],
		};
	}
	return result;
};

export default parse;
