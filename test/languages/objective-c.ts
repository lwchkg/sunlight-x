// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import { TestSupportForFile } from "../fixtures/testsupport";
let testSupport: TestSupportForFile;
describe("Objective C++ tests", function () {
  describe("file #1", function () {
    beforeAll(function () {
      testSupport = new TestSupportForFile("objective-c1.mm", "objective-c");
    });
    it("const keyword", function () {
      testSupport.AssertContentExists("keyword", "const");
    });
    it("@interface keyword", function () {
      testSupport.AssertContentExists("keyword", "@interface");
    });
    it("@property keyword", function () {
      testSupport.AssertContentExists("keyword", "@property");
    });
    it("nonatomic keyword", function () {
      testSupport.AssertContentExists("keyword", "nonatomic");
    });
    it("readonly keyword", function () {
      testSupport.AssertContentExists("keyword", "readonly");
    });
    it("void keyword", function () {
      testSupport.AssertContentExists("keyword", "void");
    });
    it("@synthesize keyword", function () {
      testSupport.AssertContentExists("keyword", "@synthesize");
    });
    it("@end keyword", function () {
      testSupport.AssertContentExists("keyword", "@end");
    });
    it("@implementation keyword", function () {
      testSupport.AssertContentExists("keyword", "@implementation");
    });
    it("@selector keyword", function () {
      testSupport.AssertContentExists("keyword", "@selector");
    });
    it("if keyword", function () {
      testSupport.AssertContentExists("keyword", "if");
    });
    it("else keyword", function () {
      testSupport.AssertContentExists("keyword", "else");
    });
    it("self keyword", function () {
      testSupport.AssertContentExists("keyword", "self");
    });
    it("super keyword", function () {
      testSupport.AssertContentExists("keyword", "super");
    });
    it("YES keyword", function () {
      testSupport.AssertContentExists("keyword", "YES");
    });
    it("NO keyword", function () {
      testSupport.AssertContentExists("keyword", "NO");
    });
    it("BOOL keyword", function () {
      testSupport.AssertContentExists("keyword", "BOOL");
    });
    it("nil keyword", function () {
      testSupport.AssertContentExists("keyword", "nil");
    });
    it("single line comment", function () {
      testSupport.AssertContentExists("comment", "//  Created by Guillaume Campagna on 10-11-10.");
    });
    it("string starting with @", function () {
      testSupport.AssertContentExists("string", '@"contentOffset"');
    });
    it("#import statement", function () {
      testSupport.AssertContentExists("preprocessorDirective", '#import "GCPagedScrollView.h"');
    });
    it("#pragma statement", function () {
      testSupport.AssertContentExists("preprocessorDirective", "#pragma mark -");
    });
    it("type name with pointer", function () {
      testSupport.AssertContentExists("named-ident", "NSString");
    });
    it("type name UIEdgeInsets", function () {
      testSupport.AssertContentExists("named-ident", "UIEdgeInsets");
    });
    it("type name CGFloat", function () {
      testSupport.AssertContentExists("named-ident", "CGFloat");
    });
    it("type name after @property with pointer", function () {
      testSupport.AssertContentExists("named-ident", "NSMutableArray");
    });
    it("type name with pointer cast", function () {
      testSupport.AssertContentExists("named-ident", "UIPageControl");
    });
    it("type name after @interface", function () {
      testSupport.AssertContentExists("named-ident", "GCPagedScrollView");
    });
    it("type name in cast", function () {
      testSupport.AssertContentExists("named-ident", "CGRect");
    });
    it("type name beginning with CG but followed by a (", function () {
      testSupport.AssertContentExists("ident", "CGRectMake");
    });
    it("method name", function () {
      testSupport.AssertContentExists("ident", "setPagingEnabled");
    });
    it("message argument name", function () {
      testSupport.AssertContentExists("messageArgumentName", "forControlEvents");
    });
    it("message argument name", function () {
      testSupport.AssertContentExists("messageArgumentName", "action");
    });
    it("message destination", function () {
      testSupport.AssertContentExists("messageDestination", "initWithFrame");
    });
    it("nested message destination", function () {
      testSupport.AssertContentExists("messageDestination", "alloc");
    });
    it("message destination", function () {
      testSupport.AssertContentExists("messageDestination", "setPagingEnabled");
    });
  });
  describe("file #2", function () {
    beforeAll(function () {
      testSupport = new TestSupportForFile("objective-c2.mm", "objective-c");
    });
    it("ident after (Class)", function () {
      testSupport.AssertContentExists("ident", "lollersk8");
    });
  });
});