export type BasicToken<T, V = string> = {
    key: T,
    value: V
}

export type OpenTagToken = BasicToken<"OpenTag">;
export type CloseTagToken = BasicToken<"CloseTag">;
export type SlashToken = BasicToken<"Slash">;
export type StringToken = BasicToken<"String">;
export type EqSignToken = BasicToken<"EqSign">;
export type DoubleQuoteToken = BasicToken<"DoubleQuote">;
export type AttrToken = BasicToken<"Attr", {
    [key: string] : Token
}>;
export type OpenCurlyBraceToken = BasicToken<"OCB">;
export type CloseCurlyBraceToken = BasicToken<"CCB">;
export type JSExprToken = BasicToken<"JSExpr">;

export type Token = OpenTagToken | CloseTagToken 
                    | SlashToken | StringToken 
                    | EqSignToken | DoubleQuoteToken
                    | OpenCurlyBraceToken | CloseCurlyBraceToken
                    | JSExprToken
                    ;

export type FrameworkTemplate = {
    template: Array<ASTElement>,
    script?: string
}

export type ASTElement = ASTComponent | StringToken | JSExprToken;

export type ASTComponent = BasicToken<"HTMLElement", Array<ASTElement>> & {
    tag: string,
    attributes: Array<AttrToken>
}
