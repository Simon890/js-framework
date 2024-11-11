import { AST } from "../types/AST";
import { ASTComponent, ASTElement, AttrToken, FrameworkTemplate, JSExprToken, StringToken, Token } from "../types/Token";

export class ParserHtmlToJson {

    private _tokens : Array<Token> = [];

    private _ast : FrameworkTemplate = {
        template: []
    };

    private _pos = 0;

    private _component() : ASTComponent {
        const token = this._currentToken();
        if(token.key == "OpenTag") {
            this._eat("OpenTag");
            const nameToken = this._eat("String") as StringToken;
            const attributes = this._attributes();
            this._eat("CloseTag");
            const body = this._body();
            this._eat("OpenTag");
            this._eat("Slash");
            this._eat("String");
            this._eat("CloseTag");
            return {
                key: "HTMLElement",
                tag: nameToken.value,
                value: body,
                attributes
            }
        }
        throw new Error("Unknown token")
    }

    private _attributes() : Array<AttrToken> {
        let attributes : Array<AttrToken> = [];
        while(this._currentToken().key == "String" && this._nextToken()?.key == "EqSign") {
            const nameToken = this._eat("String");
            this._eat("EqSign");
            this._eat("DoubleQuote");
            let valueToken : Token | null = null;
            if(this._currentToken().key == "OCB" && this._nextToken()?.key == "OCB") {
                valueToken = this._curlyExpr();
            } else {
                valueToken = this._string();
            }
            this._eat("DoubleQuote");
            attributes.push({
                key: "Attr",
                value: {
                    [nameToken.value]: valueToken
                }
            });
        }
        return attributes;
    }

    private _body() : Array<ASTElement> {
        const body : Array<ASTElement> = [];
        while(!(this._currentToken().key == "OpenTag" && this._nextToken()?.key =="Slash")) {
            const token = this._currentToken();
            if(token.key == "OpenTag") {
                body.push(this._component());
                continue;
            }
            if(token.key == "String") {
                body.push(this._seriesOfString());
                continue;
            }
            if(token.key == "OCB" && this._nextToken()?.key == "OCB") {
                body.push(this._curlyExpr());
                continue;
            }
            throw new Error("Unknown token");
        }
        return body;
    }

    private _string() : StringToken {
        return this._eat("String") as StringToken;
    }

    private _seriesOfString() : StringToken {
        let value = "";
        do {
            value += this._eat("String").value;
            value += " ";
        } while(this._currentToken().key == "String");
        return {
            key: "String",
            value: value.trim()
        }
    }

    private _curlyExpr() : JSExprToken {
        this._eat("OCB");
        this._eat("OCB");
        const jsExpr = this._seriesOfString();
        this._eat("CCB");
        this._eat("CCB");
        return {
            key: "JSExpr",
            value: jsExpr.value
        }
    }

    private _currentToken() {
        return this._tokens[this._pos];
    }

    private _nextToken() {
        if(this._pos + 1 >= this._tokens.length) return null;
        return this._tokens[this._pos + 1];
    }

    private _eat(tokenType : Token["key"]) : Token {
        if(this._currentToken().key != tokenType) throw new Error("Unexpected token");
        const token = this._currentToken();
        this._advance();
        return token;
    }

    private _advance() {
        this._pos++;
    }

    private _isEOF() : boolean {
        return this._pos >= this._tokens.length;
    }

    public parse(tokens : Array<Token>) : object {
        this._tokens = tokens;
        while(!this._isEOF()) {
            const token = this._currentToken();
            if(token.key == "OpenTag") {
                this._ast.template.push(this._component());
                continue;
            }
            if(token.key == "String") {
                this._ast.template.push(this._string());
                continue;
            }
            throw new Error("AAAAA " + token.key)
        }
        if(this._ast.template.length != 1) throw new Error("HTML template can't have more than one tag");
        if("tag" in this._ast.template[0]) {
            if(this._ast.template[0].tag != "template") {
                throw new Error("First tag must be 'template'");
            }
            this._ast.template = this._ast.template[0].value;
        }
        return this._ast;
    }
}