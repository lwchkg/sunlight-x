// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import * as util from "../util";
import type { ParserContext, Token } from "../util";
export const name = "httpd";
export const scopes = {
  string: [['"', '"', ['\\"', "\\\\"], false]],
  comment: [["#", "\n", [], true]],
  environmentVariable: [["${", "}", [], false], ["%{", "}", [], false]]
};
export const customParseRules = [// context detection inside <> (VirtualHost, etc.)
function (): (arg0: ParserContext) => Token | null | undefined {
  const words = util.createHashMap(["AuthnProviderAlias", "Directory", "DirectoryMatch", "Files", "FilesMatch", "IfDefine", "IfModule", "IfVersion", "Limit", "LimitExcept", "Location", "LocationMatch", "ProxyMatch", "Proxy", "VirtualHost", // legacy 1.3
  "IfDefine"], "\\b", false);
  return function (context: ParserContext): Token | null | undefined {
    // verify that the previous token is "<" or "</"
    let token = util.getPreviousNonWsToken(context.getAllTokens(), context.count());
    if (!token || token.name !== "operator" || token.value !== "<" && token.value !== "</") return null;
    token = util.matchWord(context, words, "context", true);
    if (!token) return null;

    // if we encounter a ">" before a newline, we're good
    for (let offset = token.value.length;; offset++) {
      const peek = context.reader.peekWithOffset(offset);
      if (peek === "" || peek === "\n") return null;
      if (peek === ">") break;
    }

    context.reader.read(token.value.length);
    return token;
  };
}(), // regex literals for mod_rewrite
function (context: ParserContext): Token | null | undefined {
  if (/[\s\n]/.test(context.reader.peek())) return null;
  // first argument after RewriteRule, delimited by \s
  // second argument after RewriteCond, delimited by \s
  const tokens = context.getAllTokens();
  let prevToken = util.getPreviousNonWsToken(tokens, context.count());
  if (!prevToken) return null;

  if (prevToken.name !== "keyword" || prevToken.value !== "RewriteRule") {
    // it might be the second argument after RewriteCond
    prevToken = util.getPreviousNonWsToken(tokens, context.count() - 1);
    if (!prevToken || prevToken.name !== "keyword" || prevToken.value !== "RewriteCond") return null;
  }

  // read to the end of the regex literal
  let regexLiteral = context.reader.read();

  while (!context.reader.isEOF()) {
    if (/[\s\n]/.test(context.reader.peek())) break;
    regexLiteral += context.reader.read();
  }

  return context.createToken("regexLiteral", regexLiteral);
}, // directives: http://httpd.apache.org/docs/current/mod/quickreference.html
function (): (arg0: ParserContext) => Token | null | undefined {
  const directives = util.createHashMap(["AcceptFilter", "AcceptMutex", "AcceptPathInfo", "AccessFileName", "Action", "AddAltByEncoding", "AddAltByType", "AddAlt", "AddCharset", "AddDefaultCharset", "AddDescription", "AddEncoding", "AddHandler", "AddIconByEncoding", "AddIconByType", "AddIcon", "AddInputFilter", "AddLanguage", "AddModuleInfo", "AddOutputFilterByType", "AddOutputFilter", "AddType", "AliasMatch", "Alias", "AllowCONNECT", "AllowEncodedSlashes", "AllowOverride", "Allow", "Anonymous_LogEmail", "Anonymous_MustGiveEmail", "Anonymous_NoUserID", "Anonymous_VerifyEmail", "Anonymous", "AuthBasicAuthoritative", "AuthBasicProvider", "AuthDBDUserPWQuery", "AuthDBDUserRealmQuery", "AuthDBMGroupFile", "AuthDBMType", "AuthDBMUserFile", "AuthDefaultAuthoritative", "AuthDigestAlgorithm", "AuthDigestDomain", "AuthDigestNcCheck", "AuthDigestNonceFormat", "AuthDigestNonceLifetime", "AuthDigestProvider", "AuthDigestQop", "AuthDigestShmemSize", "AuthGroupFile", "AuthLDAPBindAuthoritative", "AuthLDAPBindDN", "AuthLDAPBindPassword", "AuthLDAPCharsetConfig", "AuthLDAPCompareDNOnServer", "AuthLDAPDereferenceAliases", "AuthLDAPGroupAttributeIsDN", "AuthLDAPGroupAttribute", "AuthLDAPRemoteUserAttribute", "AuthLDAPRemoteUserIsDN", "AuthLDAPUrl", "AuthName", "AuthType", "AuthUserFile", "AuthzDBMAuthoritative", "AuthzDBMType", "AuthzDefaultAuthoritative", "AuthzGroupFileAuthoritative", "AuthzLDAPAuthoritative", "AuthzOwnerAuthoritative", "AuthzUserAuthoritative", "BalancerMember", "BrowserMatch", "BrowserMatchNoCase", "BufferedLogs", "CacheDefaultExpire", "CacheDirLength", "CacheDirLevels", "CacheDisable", "CacheEnable", "CacheFile", "CacheIgnoreCacheControl", "CacheIgnoreHeaders", "CacheIgnoreNoLastMod", "CacheIgnoreQueryString", "CacheIgnoreURLSessionIdentifiers", "CacheLastModifiedFactor", "CacheLockMaxAge", "CacheLockPath", "CacheLock", "CacheMaxExpire", "CacheMaxFileSize", "CacheMinFileSize", "CacheNegotiatedDocs", "CacheRoot", "CacheStoreNoStore", "CacheStorePrivate", "CGIMapExtension", "CharsetDefault", "CharsetOptions", "CharsetSourceEnc", "CheckCaseOnly", "CheckSpelling", "ChrootDir", "ContentDigest", "CookieDomain", "CookieExpires", "CookieLog", "CookieName", "CookieStyle", "CookieTracking", "CoreDumpDirectory", "CustomLog", "DavDepthInfinity", "DavGenericLockDB", "DavLockDB", "DavMinTimeout", "Dav", "DBDExptime", "DBDKeep", "DBDMax", "DBDMin", "DBDParams", "DBDPersist", "DBDPrepareSQL", "DBDriver", "DefaultIcon", "DefaultLanguage", "DefaultType", "DeflateBufferSize", "DeflateCompressionLevel", "DeflateFilterNote", "DeflateMemLevel", "DeflateWindowSize", "Deny", "DirectoryIndex", "DirectorySlash", "DocumentRoot", "DumpIOInput", "DumpIOLogLevel", "DumpIOOutput", "EnableExceptionHook", "EnableMMAP", "EnableSendfile", "ErrorDocument", "ErrorLog", "Example", "ExpiresActive", "ExpiresByType", "ExpiresDefault", "ExtendedStatus", "ExtFilterDefine", "ExtFilterOptions", "FallbackResource", "FileETag", "FilterChain", "FilterDeclare", "FilterProtocol", "FilterProvider", "FilterTrace", "ForceLanguagePriority", "ForceType", "ForensicLog", "GprofDir", "GracefulShutDownTimeout", "Group", "HeaderName", "Header", "HostnameLookups", "IdentityCheckTimeout", "IdentityCheck", "ImapBase", "ImapDefault", "ImapMenu", "Include", "IndexHeadInsert", "IndexIgnore", "IndexOptions", "IndexOrderDefault", "IndexStyleSheet", "ISAPIAppendLogToErrors", "ISAPIAppendLogToQuery", "ISAPICacheFile", "ISAPIFakeAsync", "ISAPILogNotSupported", "ISAPIReadAheadBuffer", "KeepAliveTimeout", "KeepAlive", "LanguagePriority", "LDAPCacheEntries", "LDAPCacheTTL", "LDAPConnectionTimeout", "LDAPOpCacheEntries", "LDAPOpCacheTTL", "LDAPSharedCacheFile", "LDAPSharedCacheSize", "LDAPTrustedClientCert", "LDAPTrustedGlobalCert", "LDAPTrustedMode", "LDAPVerifyServerCert", "LimitInternalRecursion", "LimitRequestBody", "LimitRequestFields", "LimitRequestFieldSize", "LimitRequestLine", "LimitXMLRequestBody", "ListenBacklog", "Listen", "LoadFile", "LoadModule", "LockFile", "LogFormat", "LogLevel", "MaxClients", "MaxKeepAliveRequests", "MaxMemFree", "MaxRequestsPerChild", "MaxRequestsPerThread", "MaxSpareServers", "MaxSpareThreads", "MaxThreads", "MCacheMaxObjectCount", "MCacheMaxObjectSize", "MCacheMaxStreamingBuffer", "MCacheMinObjectSize", "MCacheRemovalAlgorithm", "MCacheSize", "MetaDir", "MetaFiles", "MetaSuffix", "MimeMagicFile", "MinSpareServers", "MinSpareThreads", "MMapFile", "ModMimeUsePathInfo", "MultiviewsMatch", "NameVirtualHost", "NoProxy", "NWSSLTrustedCerts", "NWSSLUpgradeable", "Options", "Order", "PassEnv", "PidFile", "ProtocolEcho", "Protocol", "ProxyBadHeader", "ProxyBlock", "ProxyDomain", "ProxyErrorOverride", "ProxyFtpDirCharset", "ProxyIOBufferSize", "ProxyMaxForwards", "ProxyPassInterpolateEnv", "ProxyPassMatch", "ProxyPassReverse", "ProxyPassReverseCookieDomain", "ProxyPassReverseCookiePath", "ProxyPass", "ProxyPreserveHost", "ProxyReceiveBufferSize", "ProxyRemoteMatch", "ProxyRemote", "ProxyRequests", "ProxySCGIInternalRedirect", "ProxySCGISendfile", "ProxySet", "ProxyStatus", "ProxyTimeout", "ProxyVia", "ReadmeName", "ReceiveBufferSize", "RedirectMatch", "RedirectPermanent", "RedirectTemp", "Redirect", "RemoveCharset", "RemoveEncoding", "RemoveHandler", "RemoveInputFilter", "RemoveLanguage", "RemoveOutputFilter", "RemoveType", "RequestHeader", "RequestReadTimeout", "Require", "RewriteBase", "RewriteCond", "RewriteEngine", "RewriteLock", "RewriteLogLevel", "RewriteLog", "RewriteMap", "RewriteOptions", "RewriteRule", "RLimitCPU", "RLimitMEM", "RLimitNPROC", "Satisfy", "ScoreBoardFile", "ScriptAliasMatch", "ScriptAlias", "ScriptInterpreterSource", "ScriptLogBuffer", "ScriptLogLength", "ScriptLog", "ScriptSock", "Script", "SecureListen", "SeeRequestTail", "SendBufferSize", "ServerAdmin", "ServerAlias", "ServerLimit", "ServerName", "ServerPath", "ServerRoot", "ServerSignature", "ServerTokens", "SetEnvIfNoCase", "SetEnvIf", "SetEnv", "SetHandler", "SetInputFilter", "SetOutputFilter", "SSIEnableAccess", "SSIEndTag", "SSIErrorMsg", "SSIETag", "SSILastModified", "SSIStartTag", "SSITimeFormat", "SSIUndefinedEcho", "SSLCACertificateFile", "SSLCACertificatePath", "SSLCADNRequestFile", "SSLCADNRequestPath", "SSLCARevocationFile", "SSLCARevocationPath", "SSLCertificateChainFile", "SSLCertificateFile", "SSLCertificateKeyFile", "SSLCipherSuite", "SSLCryptoDevice", "SSLEngine", "SSLFIPS", "SSLHonorCipherOrder", "SSLInsecureRenegotiation", "SSLMutex", "SSLOptions", "SSLPassPhraseDialog", "SSLProtocol", "SSLProxyCACertificateFile", "SSLProxyCACertificatePath", "SSLProxyCARevocationFile", "SSLProxyCARevocationPath", "SSLProxyCheckPeerCN", "SSLProxyCheckPeerExpire", "SSLProxyCipherSuite", "SSLProxyEngine", "SSLProxyMachineCertificateFile", "SSLProxyMachineCertificatePath", "SSLProxyProtocol", "SSLProxyVerify", "SSLProxyVerifyDepth", "SSLRandomSeed", "SSLRenegBufferSize", "SSLRequireSSL", "SSLRequire", "SSLSessionCacheTimeout", "SSLSessionCache", "SSLStrictSNIVHostCheck", "SSLUserName", "SSLVerifyClient", "SSLVerifyDepth", "StartServers", "StartThreads", "Substitute", "SuexecUserGroup", "Suexec", "ThreadLimit", "ThreadsPerChild", "ThreadStackSize", "TimeOut", "TraceEnable", "TransferLog", "TypesConfig", "UnsetEnv", "UseCanonicalName", "UseCanonicalPhysicalPort", "UserDir", "User", "VirtualDocumentRootIP", "VirtualDocumentRoot", "VirtualScriptAliasIP", "VirtualScriptAlias", "Win32DisableAcceptEx", "XBitHack", // 1.3 legacy stuff
  "ServerType"], "\\b", true);
  return function (context: ParserContext): Token | null | undefined {
    // must be the first word on the line
    if (!context.reader.isPrecededByWhitespaceOnly()) return null;
    return util.matchWord(context, directives, "keyword");
  };
}()];
export const identFirstLetter = /[A-Za-z_]/;
export const identAfterFirstLetter = /[\w]/;
export const operators = ["</", "<", ">", "\\" // line continuation
];