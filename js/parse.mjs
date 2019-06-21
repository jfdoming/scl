import {TOKENS} from "/js/tokenize.mjs";
import {GRAMMAR} from "/js/grammar.mjs";

const matchesRule = (tokens, rule) => {
	if (!GRAMMAR[rule]) {
		return false;
	}
	
	let newIndex = 0;
	let newTree = null;
	for (const subRule of GRAMMAR[rule]) {
		if (!subRule) {
			continue;
		}
		console.log("Rule[" + rule + "]:", subRule.join(" "));
		
		let index = 0;
		let tree = [];
		for (const item of subRule) {
			if (!tokens || index >= tokens.length) {
				tree = null;
				break;
			}
			
			console.log(tokens[index][0] + "[" + tokens[index][1] + "]", "?=", item);
			if (tokens[index][0] === item) {
				// We've matched a token.
				console.log(tokens[index][0] + "[" + tokens[index][1] + "]", "==", item);
				tree.push({[item]: tokens[index]});
				++index;
				continue;
			}
			
			const matches = matchesRule(tokens.slice(index), item);
			if (!matches[0]) {
				console.log(tokens[index][0] + "[" + tokens[index][1] + "]", "!=", item);
				tree = null;
				break;
			}
			console.log(tokens[index][0] + "[" + tokens[index][1] + "]", "==", item);
			index += matches[1];
			tree.push({[item]: matches[0]});
		}
		
		if (tree) {
			newIndex = index;
			newTree = tree;
			break;
		}
	}
	return [newTree, newIndex];
};

export const parse = (tokens) => {
	if (!tokens || !tokens.length) {
		console.log("No tokens provided.");
		return {};
	}
	const result = matchesRule(tokens, "PROGRAM")[0];
	if (!result) {
		throw {
			source: "parser",
			message: ["Failed to parse program.\n"],
		};
	}
	window.result = result;
	return result;
};

export default parse;
