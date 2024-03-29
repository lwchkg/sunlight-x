// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import * as util from "../util";
import type { ScopeType } from "../languages";
import type { ParserContext, Token } from "../util";
export const name = "tsql";
export const caseInsensitive = true;
export const keywords = [// http://msdn.microsoft.com/en-us/library/ms189822.aspx
"ddw", "existsw", "precisionwall", "exit", "primary", "alter", "external", "print", "and", "fetch", "proc", "any", "file", "procedure", "as", "fillfactor", "public", "asc", "for", "raiserror", "authorization", "foreign", "read", "backup", "freetext", "readtext", "begin", "freetexttable", "reconfigure", "between", "from", "references", "break", "full", "replication", "browse", "function", "restore", "bulk", "goto", "restrict", "by", "grant", "return", "cascade", "group", "revert", "case", "having", "revoke", "check", "holdlock", "right", "checkpoint", "identity", "rollback", "close", "identity_insert", "rowcount", "clustered", "identitycol", "rowguidcol", "coalesce", "if", "rule", "collate", "in", "save", "column", "index", "schema", "commit", "inner", "securityaudit", "compute", "insert", "select", "constraint", "intersect", "session_user", "contains", "into", "set", "containstable", "is", "setuser", "continue", "join", "shutdown", "convert", "key", "some", "create", "kill", "statistics", "cross", "left", "system_user", "current", "like", "table", "current_date", "lineno", "tablesample", "current_time", "load", "textsize", "current_timestamp", "merge", "then", "current_user", "national", "to", "cursor", "nocheck", "top", "database", "nonclustered", "tran", "dbcc", "not", "transaction", "deallocate", "null", "trigger", "declare", "nullif", "truncate", "default", "of", "tsequal", "delete", "off", "union", "deny", "offsets", "unique", "desc", "on", "unpivot", "disk", "open", "update", "distinct", "opendatasource", "updatetext", "distributed", "openquery", "use", "double", "openrowset", "user", "drop", "openxml", "values", "dump", "option", "varying", "else", "or", "view", "end", "order", "waitfor", "errlvl", "outer", "when", "escape", "over", "where", "except", "percent", "while", "exec", "pivot", "with", "execute", "plan", "writetext"];
export const customParseRules = [// functions
function (): (arg0: ParserContext) => Token | null | undefined {
  const functions = util.createHashMap(["encryptbykey", "decryptbykey", "encryptbypassphrase", "decryptbypassphrase", "key_id", "key_guid", "encryptbyasmkey", "decryptbyasmkey", "encryptbycert", "decryptbycert", "cert_id", "asymkey_id", "certproperty", "signbyasymkey", "verifysignedbyasmkey", "signbycert", "verifysignedbycert", "decryptbykeyautocert", "hashbytes", "cursor_status", "datalength", "ident_seed", "ident_current", "identity", "ident_incr", "sql_variant_property", "sysdatetime", "sysdatetimeoffset", "sysutcdatetime", "current_timestamp", "getdate", "getutcdate", "datename", "datepart", "day", "month", "year", "datediff", "dateadd", "switchoffset", "todatetimeoffset", "set datefirst", "set dateformat", "set language", "sp_helplanguage", "isdate", "abs", "degrees", "rand", "acos", "exp", "round", "asin", "floor", "sign", "atan", "log", "sin", "atn2", "log10", "sqrt", "ceiling", "pi", "square", "cos", "power", "tan", "cot", "radians", "fulltextcatalogproperty", "asymkey_id", "fulltextserviceproperty", "asymkeyproperty", "index_col", "assemblyproperty", "indexkey_property", "cert_id", "indexproperty", "col_length", "key_id", "col_name", "key_guid", "columnproperty", "key_name", "database_principal_id", "object_definition", "databaseproperty", "object_id", "databasepropertyex", "object_name", "db_id", "object_schema_name", "db_name", "objectproperty", "file_id", "objectpropertyex", "file_idex", "schema_id", "file_name", "schema_name", "filegroup_id", "sql_variant_property", "filegroup_name", "symkeyproperty", "filegroupproperty", "type_id", "fileproperty", "type_name", "fn_listextendedproperty", "typeproperty", "bit_length", "concat", "octet_length", "truncate", "current_date", "current_time", "dayname", "dayofweek", "hour", "minute", "monthname", "quarter", "week", "publishingservername", "current_user", "schema_id", "database_principal_id", "schema_name", "sys.fn_builtin_permissions", "session_user", "sys.fn_my_permissions", "setuser", "has_perms_by_name", "suser_id", "is_member", "suser_sid", "is_srvrolemember", "suser_sname", "original_login", "system_user", "permissions", "suser_name", "pwdcompare", "user_id", "pwdencrypt", "user_name", "ascii", "nchar", "soundex", "char", "patindex", "space", "charindex", "quotename", "str", "difference", "replace", "stuff", "left", "replicate", "substring", "len", "reverse", "unicode", "lower", "right", "upper", "ltrim", "rtrim", "app_namexx", "case", "cast", "convert", "coalesce", "collationproperty", "columns_updated", "current_timestamp", "current_user", "datalength", "error_line", "error_message", "error_number", "error_procedure", "error_severity", "error_state", "fn_helpcollations", "fn_servershareddrives", "fn_virtualfilestats", "formatmessage", "getansinull", "host_id", "host_name", "ident_current", "ident_incr", "ident_seed", "identity", "isdate", "isnull", "isnumeric", "newid", "nullif", "parsename", "original_login", "rowcount_big", "scope_identity", "serverproperty", "sessionproperty", "session_user", "stats_date", "dm_db_index_physical_stats", "system_user", "user_name", "xact_state", "fn_virtualfilestats", "patindex", "textvalid", "textptr", "columns_updated", "eventdata", "trigger_nestlevel", "update", "containstable", "openquery", "freetexttable", "openrowset", "opendatasource", "openxml", "vg", "min", "checksum_agg", "over clause", "count", "rowcount_big", "count_big", "stdev", "grouping", "stdevp", "grouping_id", "sum", "max", "var", "rank", "ntile", "dense_rank", "row_number", "varp"], "\\b", true);
  // functions need to be followed by a "(", otherwise they are (potentially) keywords or just regular idents
  return function (context: ParserContext): Token | null | undefined {
    const token = util.matchWord(context, functions, "function", true);
    if (!token) return null;

    // the next non-whitespace character must be a "("
    for (let offset = token.value.length;; offset++) {
      const peek = context.reader.peekWithOffset(offset);
      if (peek === "") return null;
      if (peek === "(") break;
      if (!/\s/.test(peek)) return null;
    }

    context.reader.read(token.value.length);
    return token;
  };
}()];
export const customTokens = {
  constant: {
    values: ["@@FETCH_STATUS", "@@DATEFIRST", "@@OPTIONS", "@@DBTS", "@@REMSERVER", "@@LANGID", "@@SERVERNAME", "@@LANGUAGE", "@@SERVICENAME", "@@LOCK_TIMEOUT", "@@SPID", "@@MAX_CONNECTIONS", "@@TEXTSIZE", "@@MAX_PRECISION", "@@VERSION", "@@NESTLEVEL", "@@CURSOR_ROWS", "@@PROCID", "@@IDENTITY", "@@TRANCOUNT", "@@ERROR", "@@ROWCOUNT", "@@CONNECTIONS", "@@PACK_RECEIVED", "@@CPU_BUSY", "@@PACK_SENT", "@@TIMETICKS", "@@IDLE", "@@TOTAL_ERRORS", "@@IO_BUSY", "@@TOTAL_READ", "@@PACKET_ERRORS", "@@TOTAL_WRITE"],
    boundary: "\\b"
  }
};
export const scopes: Record<string, ScopeType[]> = {
  string: [['"', '"', util.escapeSequences.concat(['\\"']), false], ["'", "'", ["\\'", "\\\\"], false]],
  comment: [["--", "\n", [], true], ["/*", "*/", [], false]],
  quotedIdent: [["[", "]", ["\\[", "\\\\"], false]]
};
export const identFirstLetter = /[A-Za-z_]/;
export const identAfterFirstLetter = /\w/;
export const namedIdentRules = {
  // table/db names
  follows: [[{
    token: "keyword",
    values: ["from", "join"]
  }, {
    token: "default"
  }], [{
    token: "keyword",
    values: ["from", "join"]
  }, {
    token: "default"
  }, {
    token: "ident"
  }, util.whitespace, {
    token: "operator",
    values: ["."]
  }, util.whitespace]]
};
export const operators = [// arithmetic
"+", "-", "*", "/", "%", // boolean
"&&", "||", // bitwise
"|", "&", "^", ">>", "<<", // inequality
"<>", "<=>", "<=", "<", ">=", ">", "==", "!=", // unary
"!", "~", // assignment
":=", "=", // other
"."];