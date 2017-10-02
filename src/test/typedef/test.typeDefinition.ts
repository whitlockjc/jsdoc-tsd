import { expect } from "chai";
import * as dom from "dts-dom";
import * as fs from "fs";
import * as path from "path";
import { JSDocTsdParser } from "../../core/jsdoc-tsd-parser";

describe("JSDocTsdParser.parse.typedef", () => {
	it("Should create an interface", () => {
		let typeData: ITypedefDoclet = JSON.parse(fs.readFileSync(path.resolve(__dirname, "data/typedefinition.json"), { encoding: "utf-8" }));

		if (!typeData.properties) {
			throw new Error("The type defintion has no properties");
		}

		let parser = new JSDocTsdParser();
		parser.parse([typeData]);

		let result = parser.getResultItems();
		expect(result).haveOwnProperty(typeData.longname);

		let interfaceDeclarations: dom.InterfaceDeclaration[] = result[typeData.longname] as dom.InterfaceDeclaration[];
		expect(interfaceDeclarations.length).to.eq(1);
		expect(interfaceDeclarations[0].name).to.eq(typeData.name);
		expect(interfaceDeclarations[0].jsDocComment).to.eq("My other object");

		expect(interfaceDeclarations[0].members.length).to.eq(typeData.properties.length);
		let property: dom.PropertyDeclaration = interfaceDeclarations[0].members[0] as dom.PropertyDeclaration;
		expect(property.name).to.eq(typeData.properties[0].name);
		expect(property.type).to.eq(typeData.properties[0].type.names[0] as dom.Type);
		expect(property.jsDocComment).to.eq(typeData.properties[0].description);
	});
});