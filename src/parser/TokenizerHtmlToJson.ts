import { Token } from "../types/Token";

export class TokenizerHtmlToJson {

    private _pos : number = 0;
    private _htmlStr!: string;
    private _tokens : Array<Token> = [];

    private _advance() {
        this._pos++
    }

    private _currentChar() : string {
        return this._htmlStr[this._pos];
    }

    private _isEOF() : boolean {
        return this._pos >= this._htmlStr.length;
    }

    private _isEmptySpace() : boolean {
        return REGEXPS.EMPTY.test(this._currentChar())
    }

    private _isOpenTag() : boolean {
        return REGEXPS.OPEN_TAG.test(this._currentChar());
    }

    private _isCloseTag() : boolean {
        return REGEXPS.CLOSE_TAG.test(this._currentChar());
    }

    private _isSlash() : boolean {
        return REGEXPS.SLASH.test(this._currentChar());
    }

    private _isChar() : boolean {
        return REGEXPS.CHAR.test(this._currentChar());
    }

    private _isNumber() : boolean {
        return REGEXPS.NUMBER.test(this._currentChar());
    }

    private _isEqSign() : boolean {
        return REGEXPS.EQ.test(this._currentChar());
    }

    private _isDoubleQuote() : boolean {
        return REGEXPS.DOUBLE_QUOTE.test(this._currentChar());
    }

    private _isOpenCurlyBrace() : boolean {
        return REGEXPS.OPEN_CURLY_BRACE.test(this._currentChar());
    }

    private _isCloseCurlyBrace() : boolean {
        return REGEXPS.CLOSE_CURLY_BRACE.test(this._currentChar());
    }

    private _isAlphanumeric() : boolean {
        return this._isChar() || this._isNumber();
    }

    public parse(htmlStr : string) : Array<Token> {
        this._htmlStr = htmlStr;
        while(!this._isEOF()) {
            const char = this._currentChar();
            
            if(this._isEmptySpace()) {
                this._advance();
                continue;
            }
            
            if(this._isOpenTag()) {
                this._tokens.push({
                    key: "OpenTag",
                    value: "<"
                });
                this._advance();
                continue;
            }

            if(this._isCloseTag()) {
                this._tokens.push({
                    key: "CloseTag",
                    value: ">"
                });
                this._advance();
                continue;
            }

            if(this._isSlash()) {
                this._tokens.push({
                    key: "Slash",
                    value: "/"
                });
                this._advance();
                continue;
            }

            if(this._isEqSign()) {
                this._tokens.push({
                    key: "EqSign",
                    value: "="
                });
                this._advance();
                continue;
            }

            if(this._isDoubleQuote()) {
                this._tokens.push({
                    key: "DoubleQuote",
                    value: "\""
                });
                this._advance();
                continue;
            }

            if(this._isOpenCurlyBrace()) {
                this._tokens.push({
                    key: "OCB",
                    value: "{"
                });
                this._advance();
                continue;
            }

            if(this._isCloseCurlyBrace()) {
                this._tokens.push({
                    key: "CCB",
                    value: "}"
                });
                this._advance();
                continue;
            }

            if(this._isAlphanumeric()) {
                let text = "";
                while(this._isAlphanumeric() && !this._isEOF()) {
                    text += this._currentChar();
                    this._advance();
                }
                this._tokens.push({
                    key: "String",
                    value: text
                });
                continue;
            }

            throw new Error("Unexpected token " + this._currentChar());
        }
        return this._tokens;
    }

    
}

const REGEXPS = Object.freeze({
    EMPTY: /[\s\t\n]/,
    OPEN_TAG: /[\<]/,
    CLOSE_TAG: /[\>]/,
    SLASH: /[\/]/,
    CHAR: /[a-zA-Z]/,
    NUMBER: /[0-9]/,
    EQ: /[=]/,
    DOUBLE_QUOTE: /[\"]/,
    OPEN_CURLY_BRACE: /[\{]/,
    CLOSE_CURLY_BRACE: /[\}}]/,
});