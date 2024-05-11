import { Component, EnvironmentInjector, Injector, NgModule } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

// Testing api resources
import { ComponentCreator, DynamicHooksComponent, OutletParseResult, ParserEntryResolver, SelectorHookParserConfig, provideDynamicHooks } from '../testing-api';
import { DynamicHooksService } from '../testing-api';

// Custom testing resources
import { defaultBeforeEach, prepareTestingModule } from './shared';
import { SingleTagTestComponent } from '../resources/components/singleTag/singleTagTest.c';
import { MultiTagTestComponent } from '../resources/components/multiTagTest/multiTagTest.c';
import { GENERICINJECTIONTOKEN } from '../resources/services/genericInjectionToken';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { RootTestService } from '../resources/services/rootTestService';
import { By } from '@angular/platform-browser';

describe('SelectorHookParserConfig', () => {
  let testBed;
  let fixture: any;
  let comp: DynamicHooksComponent;
  let context: any;

  beforeEach(() => {
    ({testBed, fixture, comp, context} = defaultBeforeEach());
  });

  // ----------------------------------------------------------------------------

  it('#should throw errors on invalid parser configs', () => {
    // In general, should not include parsers with invalid configs
    spyOn(console, 'error').and.callThrough();
    comp.parsers = [{
      component: SingleTagTestComponent,
      selector: true
    } as any];
    comp.ngOnChanges({content: true, context: true} as any);

    expect(comp.activeParsers.length).toBe(0);
    expect((<any>console.error)['calls'].count()).toBe(1);

    // Get instance of SelectorHookParserConfigResolver for faster, more detailed tests
    const configResolver = TestBed.inject(ParserEntryResolver)['parserResolver'];

    // No config
    let config: any = null;
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('Missing the required "component" property for the SelectorHookParserConfig. Must be either the component class or a LazyLoadComponentConfig.'));

    // Lazy-loading config without selector
    config = {
      component: {importPromise: () => new Promise(() => {}), importName: 'someComponent'}
    };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error(`When using lazy-loaded dynamic components, you have to specify the "selector" property in the parser config (that will be used to find it in the text), as the real selector can't be known before the component is loaded.`));

    // Wrong component type
    config = { component: true };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('The "component" property in the SelectorHookParserConfig must either contain the component class or a LazyLoadComponentConfig.'));

    // Wrong name type
    config = { component: SingleTagTestComponent, name: true };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('The submitted "name" property in the SelectorHookParserConfig must be of type string, was boolean'));

    // Wrong selector type
    config = { component: SingleTagTestComponent, selector: true };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('The submitted "selector" property in the SelectorHookParserConfig must be of type string, was boolean'));

    // Wrong enclosing type
    config = { component: SingleTagTestComponent, enclosing: 'true' };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('The submitted "enclosing" property in the SelectorHookParserConfig must be of type boolean, was string'));

    // Wrong backet style type
    config = { component: SingleTagTestComponent, bracketStyle: {brackets: '<>'} };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('The submitted "bracketStyle" property in the SelectorHookParserConfig must have the form {opening: string, closing: string}'));

    // Wrong unescapeStrings type
    config = { component: SingleTagTestComponent, unescapeStrings: 'true' };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('The submitted "unescapeStrings" property in the SelectorHookParserConfig must be of type boolean, was string'));

    // Wrong parseInputs type
    config = { component: SingleTagTestComponent, parseInputs: 'true' };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('The submitted "parseInputs" property in the SelectorHookParserConfig must be of type boolean, was string'));

    // Wrong inputsBlacklist type
    config = { component: SingleTagTestComponent, inputsBlacklist: true };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('The submitted "inputsBlacklist" property in the SelectorHookParserConfig must be an array of strings.'));

    // Wrong inputsBlacklist entry type
    config = { component: SingleTagTestComponent, inputsBlacklist: [true] };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('All entries of the submitted "inputsBlacklist" property in the SelectorHookParserConfig must be of type string, boolean found.'));

    // Wrong inputsWhitelist type
    config = { component: SingleTagTestComponent, inputsWhitelist: true };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('The submitted "inputsWhitelist" property in the SelectorHookParserConfig must be an array of strings.'));

    // Wrong inputsWhitelist entry type
    config = { component: SingleTagTestComponent, inputsWhitelist: [true] };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('All entries of the submitted "inputsWhitelist" property in the SelectorHookParserConfig must be of type string, boolean found.'));

    // Wrong outputsBlacklist type
    config = { component: SingleTagTestComponent, outputsBlacklist: true };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('The submitted "outputsBlacklist" property in the SelectorHookParserConfig must be an array of strings.'));

    // Wrong outputsBlacklist entry type
    config = { component: SingleTagTestComponent, outputsBlacklist: [true] };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('All entries of the submitted "outputsBlacklist" property in the SelectorHookParserConfig must be of type string, boolean found.'));

    // Wrong outputsWhitelist type
    config = { component: SingleTagTestComponent, outputsWhitelist: true };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('The submitted "outputsWhitelist" property in the SelectorHookParserConfig must be an array of strings.'));

    // Wrong outputsWhitelist entry type
    config = { component: SingleTagTestComponent, outputsWhitelist: [true] };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('All entries of the submitted "outputsWhitelist" property in the SelectorHookParserConfig must be of type string, boolean found.'));

    // Wrong allowContextInBindings entry type
    config = { component: SingleTagTestComponent, allowContextInBindings: 'true' };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('The submitted "allowContextInBindings" property in the SelectorHookParserConfig must be of type boolean, was string'));

    // Wrong allowContextFunctionCalls entry type
    config = { component: SingleTagTestComponent, allowContextFunctionCalls: 'true' };
    expect(() => configResolver.processConfig(config as any))
      .toThrow(new Error('The submitted "allowContextFunctionCalls" property in the SelectorHookParserConfig must be of type boolean, was string'));
  });

  it('#should recognize custom selectors', () => {
    ({fixture, comp} = prepareTestingModule([{
      component: MultiTagTestComponent,
      selector: 'atotallycustomselector'
    }]));

    const testText = `<p>This is a custom selector: <atotallycustomselector [someInput]="true">for the multitag component</atotallycustomselector>.</p>`;
    comp.content = testText;
    comp.ngOnChanges({content: true} as any);

    expect(fixture.nativeElement.querySelector('.multitag-component')).not.toBe(null);
    expect(fixture.nativeElement.querySelector('.multitag-component').innerHTML.trim()).toBe('for the multitag component');
  });

  it('#should recognize custom injectors', fakeAsync(() => {

    // Without custom element injectors, genericInjectionValue should be null
    const testText = `<dynhooks-singletagtest>`;
    const config: SelectorHookParserConfig = {
      component: SingleTagTestComponent,
      enclosing: false,
      injector: undefined,
      environmentInjector: undefined
    };
    
    ({fixture, comp} = prepareTestingModule([config]));
    comp.content = testText;
    comp.ngOnChanges({content: true} as any);
    expect(comp.hookIndex[1].componentRef!.instance.genericInjectionValue).toBeNull();

    // With a custom injector, genericInjectionValue should now be found
    ({fixture, comp} = prepareTestingModule([config]));
    config.injector = Injector.create({
      providers: [{provide: GENERICINJECTIONTOKEN, useValue: { name: 'test value' } }]
    });

    comp.content = testText;
    comp.ngOnChanges({content: true} as any);
    expect(comp.hookIndex[1].componentRef!.instance.genericInjectionValue).toEqual({ name: 'test value' });

    // The same should also work with a custom environment injector
    config.injector = undefined;
    config.environmentInjector = Injector.create({
      parent: TestBed.inject(EnvironmentInjector),
      providers: [{provide: GENERICINJECTIONTOKEN, useValue: { name: 'test value' } }]
    }) as EnvironmentInjector;

    comp.content = testText;
    comp.ngOnChanges({content: true} as any);
    expect(comp.hookIndex[1].componentRef!.instance.genericInjectionValue).toEqual({ name: 'test value' });

    // However, be careful to set a valid parent field on a custom environment injector, 
    // otherwise it will break DI hierarchy and result in an error
    config.injector = undefined;
    config.environmentInjector = Injector.create({
      providers: [{provide: GENERICINJECTIONTOKEN, useValue: { name: 'test value' } }]
    }) as EnvironmentInjector;

    comp.content = testText;

    spyOn(console, 'error');
    try {
      comp.ngOnChanges({content: true} as any);
    } catch (e) {}
    expect((<any>console.error)['calls'].count()).toBe(1);
  }));

  it('#should recognize singletag hooks', () => {
    ({fixture, comp} = prepareTestingModule([{
      component: MultiTagTestComponent,
      enclosing: false
    }]));

    const testText = `<p>Here the multitag hook is set to be single tag instead: <dynhooks-multitagtest [fonts]="['arial', 'calibri']">text within hook</dynhooks-multitagtest></p>`;
    comp.content = testText;
    comp.ngOnChanges({content: true} as any);

    expect(fixture.nativeElement.querySelector('.multitag-component')).not.toBe(null);
    expect(fixture.nativeElement.querySelector('.multitag-component').innerHTML.trim()).toBe('');
    expect(fixture.nativeElement.children[0].children[0].innerHTML).not.toContain('text within hook');
    expect(fixture.nativeElement.children[0].innerHTML).toContain('text within hook');
    expect(Object.keys(comp.hookIndex).length).toBe(1);
    expect(comp.hookIndex[1].componentRef!.instance.constructor.name).toBe('MultiTagTestComponent');
    expect(comp.hookIndex[1].componentRef!.instance.fonts).toEqual(['arial', 'calibri']);
  });

  it('#should recognize unique bracket styles', () => {
    ({fixture, comp} = prepareTestingModule([{
      component: MultiTagTestComponent,
      bracketStyle: {opening: '[[', closing: ']]'}
    }]));

    const testText = `<p>Here is a hook with a unique bracket style: [[dynhooks-multitagtest [fonts]="['arial', 'calibri']"]]text within hook[[/dynhooks-multitagtest]]</p>`;
    comp.content = testText;
    comp.ngOnChanges({content: true} as any);

    expect(fixture.nativeElement.querySelector('.multitag-component')).not.toBe(null);
    expect(fixture.nativeElement.querySelector('.multitag-component').innerHTML.trim()).toBe('text within hook');
    expect(Object.keys(comp.hookIndex).length).toBe(1);
    expect(comp.hookIndex[1].componentRef!.instance.constructor.name).toBe('MultiTagTestComponent');
    expect(comp.hookIndex[1].componentRef!.instance.fonts).toEqual(['arial', 'calibri']);
  });

  it('#should refrain from parsing inputs, if requested', () => {
    ({fixture, comp} = prepareTestingModule([{
      component: MultiTagTestComponent,
      parseInputs: false,
      refreshBindingsOnPushOnly: false
    }]));

    const testText = `<p>Here is a hook whose input shall not be parsed: <dynhooks-multitagtest [nr]="123" [fonts]="['arial', {prop: true}]">text within hook</dynhooks-multitagtest></p>`;
    comp.content = testText;
    comp.ngOnChanges({content: true} as any);

    expect(fixture.nativeElement.querySelector('.multitag-component')).not.toBe(null);
    expect(fixture.nativeElement.querySelector('.multitag-component').innerHTML.trim()).toBe('text within hook');
    expect(Object.keys(comp.hookIndex).length).toBe(1);
    expect(comp.hookIndex[1].componentRef!.instance.constructor.name).toBe('MultiTagTestComponent');
    expect(comp.hookIndex[1].componentRef!.instance.nr).toEqual('123');                          // <-- Must be string, not number
    expect(comp.hookIndex[1].componentRef!.instance.fonts).toEqual("['arial', {prop: true}]");   // <-- Must be string, not array

    // Expect them to still be unparsed after update
    spyOn(comp['componentUpdater'], 'refresh').and.callThrough();
    comp.ngDoCheck();
    expect((comp['componentUpdater'].refresh as any)['calls'].count()).toBe(1);
    expect(comp.hookIndex[1].componentRef!.instance.constructor.name).toBe('MultiTagTestComponent');
    expect(comp.hookIndex[1].componentRef!.instance.nr).toEqual('123');
    expect(comp.hookIndex[1].componentRef!.instance.fonts).toEqual("['arial', {prop: true}]");
  });

  it('#should unescapeStrings, if requested', () => {
    const testText = `<dynhooks-singletagtest
      [stringPropAlias]="'This is a \\'test\\' string.'"
      [simpleObject]="{someProp: 'His name was O\\'Hara.'}"
      [simpleArray]="[context['maneu\\vers'].defend('O\\'Hara')]"
    >`;

    // Unescape strings
    ({fixture, comp} = prepareTestingModule([{
      component: SingleTagTestComponent,
      enclosing: false,
      unescapeStrings: true
    }]));

    comp.content = testText;
    comp.context = context;
    comp.ngOnChanges({content: true, context: true} as any);
    let loadedComp = comp.hookIndex[1].componentRef!.instance;

    expect(loadedComp.stringProp).toBe("This is a 'test' string.");
    expect(loadedComp.simpleObject).toEqual({someProp: "His name was O'Hara."});
    expect(loadedComp.simpleArray).toEqual(["defending O'Hara!"]);

    // Leave strings as they are
    ({fixture, comp} = prepareTestingModule([{
      component: SingleTagTestComponent,
      enclosing: false,
      unescapeStrings: false
    }]));

    comp.content = testText;
    comp.context = context;
    comp.ngOnChanges({content: true, context: true} as any);
    loadedComp = comp.hookIndex[1].componentRef!.instance;

    expect(loadedComp.stringProp).toBe("This is a \\'test\\' string.");
    expect(loadedComp.simpleObject).toEqual({someProp: "His name was O\\'Hara."});
    expect(loadedComp.simpleArray).toEqual([undefined]); // Won't be able to find variable with \-chars in property name. Should default to undefined.
  });

  it('#should apply input black/whitelists and output black/whitelists', () => {
    const testText = `
      <dynhooks-singletagtest
        [stringPropAlias]="'this is an example string'"
        [numberProp]="917"
        [simpleArray]="[123, true, 'test']"
        (componentClickedAlias)="123"
        (eventTriggeredAlias)="456"
        (httpResponseReceived)="789"
      >
    `;

    // a) Test inputBlacklist
    ({fixture, comp} = prepareTestingModule([{component: SingleTagTestComponent, enclosing: false, inputsBlacklist: ['numberProp']}]));
    comp.content = testText;
    comp.ngOnChanges({content: true} as any);
    let loadedComp = comp.hookIndex[1].componentRef!.instance;

    expect(loadedComp.stringProp).toBe('this is an example string');
    expect(loadedComp.numberProp).toBeUndefined();
    expect(loadedComp.simpleArray).toEqual([123, true, 'test']);
    expect(comp.hookIndex[1].outputSubscriptions['componentClicked']).toBeDefined();
    expect(comp.hookIndex[1].outputSubscriptions['eventTriggered']).toBeDefined();
    expect(comp.hookIndex[1].outputSubscriptions['httpResponseReceived']).toBeDefined();

    // b) Test inputWhitelist
    ({fixture, comp} = prepareTestingModule([{component: SingleTagTestComponent, enclosing: false, inputsWhitelist: ['simpleArray']}]));
    comp.content = testText;
    comp.ngOnChanges({content: true} as any);
    loadedComp = comp.hookIndex[1].componentRef!.instance;

    expect(loadedComp.stringProp).toBeUndefined();
    expect(loadedComp.numberProp).toBeUndefined();
    expect(loadedComp.simpleArray).toEqual([123, true, 'test']);
    expect(comp.hookIndex[1].outputSubscriptions['componentClicked']).toBeDefined();
    expect(comp.hookIndex[1].outputSubscriptions['eventTriggered']).toBeDefined();
    expect(comp.hookIndex[1].outputSubscriptions['httpResponseReceived']).toBeDefined();

    // c) Test inputBlacklist + inputWhitelist
    ({fixture, comp} = prepareTestingModule([{component: SingleTagTestComponent, enclosing: false, inputsBlacklist: ['simpleArray'], inputsWhitelist: ['simpleArray', 'numberProp']}]));
    comp.content = testText;
    comp.ngOnChanges({content: true} as any);
    loadedComp = comp.hookIndex[1].componentRef!.instance;

    expect(loadedComp.stringProp).toBeUndefined();
    expect(loadedComp.numberProp).toBe(917);
    expect(loadedComp.simpleArray).toBeUndefined();
    expect(comp.hookIndex[1].outputSubscriptions['componentClicked']).toBeDefined();
    expect(comp.hookIndex[1].outputSubscriptions['eventTriggered']).toBeDefined();
    expect(comp.hookIndex[1].outputSubscriptions['httpResponseReceived']).toBeDefined();

    // d) Test outputBlacklist
    ({fixture, comp} = prepareTestingModule([{component: SingleTagTestComponent, enclosing: false, outputsBlacklist: ['eventTriggeredAlias']}]));
    comp.content = testText;
    comp.ngOnChanges({content: true} as any);
    loadedComp = comp.hookIndex[1].componentRef!.instance;

    expect(loadedComp.stringProp).toBe('this is an example string');
    expect(loadedComp.numberProp).toBe(917);
    expect(loadedComp.simpleArray).toEqual([123, true, 'test']);
    expect(comp.hookIndex[1].outputSubscriptions['componentClicked']).toBeDefined();
    expect(comp.hookIndex[1].outputSubscriptions['eventTriggered']).toBeUndefined();
    expect(comp.hookIndex[1].outputSubscriptions['httpResponseReceived']).toBeDefined();

    // e) Test outputWhitelist
    ({fixture, comp} = prepareTestingModule([{component: SingleTagTestComponent, enclosing: false, outputsWhitelist: ['httpResponseReceived']}]));
    comp.content = testText;
    comp.ngOnChanges({content: true} as any);
    loadedComp = comp.hookIndex[1].componentRef!.instance;

    expect(loadedComp.stringProp).toBe('this is an example string');
    expect(loadedComp.numberProp).toBe(917);
    expect(loadedComp.simpleArray).toEqual([123, true, 'test']);
    expect(comp.hookIndex[1].outputSubscriptions['componentClicked']).toBeUndefined();
    expect(comp.hookIndex[1].outputSubscriptions['eventTriggered']).toBeUndefined();
    expect(comp.hookIndex[1].outputSubscriptions['httpResponseReceived']).toBeDefined();

    // f) Test outputBlacklist + outputWhitelist
    ({fixture, comp} = prepareTestingModule([{component: SingleTagTestComponent, enclosing: false, outputsBlacklist: ['httpResponseReceived'], outputsWhitelist: ['eventTriggeredAlias', 'httpResponseReceived']}]));
    comp.content = testText;
    comp.ngOnChanges({content: true} as any);
    loadedComp = comp.hookIndex[1].componentRef!.instance;

    expect(loadedComp.stringProp).toBe('this is an example string');
    expect(loadedComp.numberProp).toBe(917);
    expect(loadedComp.simpleArray).toEqual([123, true, 'test']);
    expect(comp.hookIndex[1].outputSubscriptions['componentClicked']).toBeUndefined();
    expect(comp.hookIndex[1].outputSubscriptions['eventTriggered']).toBeDefined();
    expect(comp.hookIndex[1].outputSubscriptions['httpResponseReceived']).toBeUndefined();
  });

  it('#should disallow context access, if requested', () => {
    const testText = `<dynhooks-singletagtest [numberProp]="context.order" (httpResponseReceived)="context.maneuvers.meditate()">`;

    // Context access allowed
    ({fixture, comp} = prepareTestingModule([{
      component: SingleTagTestComponent,
      enclosing: false,
      allowContextInBindings: true
    }]));

    comp.content = testText;
    comp.context = context;
    comp.ngOnChanges({content: true, context: true} as any);
    let loadedComp = comp.hookIndex[1].componentRef!.instance;
    spyOn(context.maneuvers, 'meditate').and.callThrough();

    expect(loadedComp.numberProp).toBe(66);
    loadedComp.httpResponseReceived.emit(200);
    expect(context.maneuvers.meditate['calls'].count()).toBe(1);

    // Context access not allowed
    ({fixture, comp} = prepareTestingModule([{
      component: SingleTagTestComponent,
      enclosing: false,
      allowContextInBindings: false
    }]));

    comp.content = testText;
    comp.context = context;
    comp.ngOnChanges({content: true, context: true} as any);
    loadedComp = comp.hookIndex[1].componentRef!.instance;

    expect(loadedComp.numberProp).toBe(undefined);
    loadedComp.httpResponseReceived.emit(300);
    expect(context.maneuvers.meditate['calls'].count()).toBe(1); // Should not have increased from before
  });

  it('#should disallow context function calls, if requested', () => {
    const testText = `<dynhooks-singletagtest [stringPropAlias]="context.maneuvers.defend('the innocent')" (httpResponseReceived)="context.maneuvers.meditate()">`;

    // Context access allowed
    ({fixture, comp} = prepareTestingModule([{
      component: SingleTagTestComponent,
      enclosing: false,
      allowContextFunctionCalls: true
    }]));

    comp.content = testText;
    comp.context = context;
    comp.ngOnChanges({content: true, context: true} as any);
    let loadedComp = comp.hookIndex[1].componentRef!.instance;
    spyOn(context.maneuvers, 'meditate').and.callThrough();

    expect(loadedComp.stringProp).toBe('defending the innocent!');
    loadedComp.httpResponseReceived.emit(200);
    expect(context.maneuvers.meditate['calls'].count()).toBe(1);

    // Context access not allowed
    ({fixture, comp} = prepareTestingModule([{
      component: SingleTagTestComponent,
      enclosing: false,
      allowContextFunctionCalls: false
    }]));

    comp.content = testText;
    comp.context = context;
    comp.ngOnChanges({content: true, context: true} as any);
    loadedComp = comp.hookIndex[1].componentRef!.instance;

    expect(loadedComp.stringProp).toBe(undefined);
    loadedComp.httpResponseReceived.emit(200);
    expect(context.maneuvers.meditate['calls'].count()).toBe(1); // Should not have increased from before
  });
});
