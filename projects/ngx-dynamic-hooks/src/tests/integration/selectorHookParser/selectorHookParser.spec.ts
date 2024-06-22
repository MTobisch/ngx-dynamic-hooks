// Custom testing resources
import { WhateverTestComponent } from '../../resources/components/whateverTest/whateverTest.c';
import { MultiTagTestComponent } from '../../resources/components/multiTagTest/multiTagTest.c';
import { SingleTagTestComponent } from '../../resources/components/singleTag/singleTagTest.c';
import { DynamicHooksComponent } from '../../testing-api';
import { defaultBeforeEach } from '../shared';

describe('SelectorHookParser', () => {
  let testBed;
  let fixture: any;
  let comp: DynamicHooksComponent;
  let context: any;

  beforeEach(() => {
    ({testBed, fixture, comp, context} = defaultBeforeEach());
  });

  // ----------------------------------------------------------------------------

  it('#should load single tag selectors', () => {
    const testText = `<p>This p-element has a <span>span-element with a component <singletagtest [stringPropAlias]="'/media/maps/valley_of_the_four_winds.png'" [simpleArray]='["chen stormstout", "nomi"]'></span> within it.</p>`;
    comp.content = testText;
    comp.ngOnChanges({content: true} as any);

    expect(fixture.nativeElement.querySelector('.singletag-component')).not.toBe(null); // Component has loaded
    expect(Object.values(comp.hookIndex).length).toBe(1);
    expect(comp.hookIndex[1].componentRef!.instance.constructor.name).toBe('SingleTagTestComponent');
  });

  it('#should load a multi tag selectors', () => {
    const testText = `<p>This is a multi tag component <multitagtest>This is the inner content.</multitagtest>.</p>`;
    comp.content = testText;
    comp.ngOnChanges({content: true} as any);

    expect(fixture.nativeElement.querySelector('.multitag-component')).not.toBe(null); // Component has loaded
    expect(fixture.nativeElement.querySelector('.multitag-component').innerHTML.trim()).toBe('This is the inner content.'); // Transcluded content works
    expect(Object.values(comp.hookIndex).length).toBe(1);
    expect(comp.hookIndex[1].componentRef!.instance.constructor.name).toBe('MultiTagTestComponent');
  });

  it('#should parse inputs properly', () => {
    const testText = `
    <multitagtest [fonts]="['test', 'something', 'here']"></multitagtest>
    <singletagtest
      id="someid"
      id-with-hyphen="something"
      inputWithoutBrackets="{test: 'Hullo!'}"
      emptyInputWithoutBrackets=""
      [emptyInput]=""
      [emptyStringInput]="''"
      [_weird5Input$Name13]="'Even names like this should be recognized.'"
      [nonInputProperty]="'this should not be set as input'"
      [stringPropAlias]="'this is just a test string'"
      data-somevalue="this is a data value"
      [numberProp]="846"
      [booleanProp]="true"
      [nullProp]="null"
      [undefinedProp]='undefined'
      [simpleObject]='{config: {lightbox: false, size: {width: "200px", height: "100px"}}}'
      [simpleArray]="[1, 2, 'three', true, undefined, null, [5, 6]]"
      [variable]='context["$lightS\\aberCollection"][2]'
      [variableLookalike]='"seems like a var, but isnt: [{context.thisShouldntBeRecognizedAsAVariable}]"'
      [variableInObject]='{propInObj: context["_jediCouncil"].kiAdiMundi[8]["planet"]}'
      [variableInArray]='["melon", context["_jediCouncil"].yoda900, 798]'
      [contextWithoutAnything]="context"
      [nestedFunctions]="{dangerousStr: 'heres a couple of (dangerous) , chars', functionsProp: [context.maneuvers.combo(context.maneuvers.defend('Leia'), context.maneuvers.attack(context.maneuvers.generateEnemy('Wampa')['name']))]}"
      [nestedFunctionsInBrackets]="[
        context.maneuvers[context['maneuvers'].findAppropriateAction(context.maneuvers.getMentalState())]().action,
        context['maneuvers'][context.maneuvers['findAppropriateAction']('peaceful')]().state
      ]"
      [everythingTogether]="[
        'Jar-Jar Binks',
        35,
        {
          someObjProp: [
            true,
            \`hello\`,
            null,
            76,
            '02:46am',
            context.greeting
          ]
        },
        [
          'another',
          'variable',
          context._jediCouncil.skywalker,
          'laststring',
          {
            complexFunctionCall: context.maneuvers[context['maneuvers'].findAppropriateAction(context.maneuvers.getMentalState())]().state
          }
        ]
      ]"
    >
    <p>This should be untouched</p>
    <whatevertest [nr]="123" [config]="{name: 'test', supportedValues: [1, 2, 3], active: true}"></whatevertest>`;
    comp.content = testText;
    comp.context = context;
    comp.ngOnChanges({content: true, context: true} as any);
    const firstComp: MultiTagTestComponent = comp.hookIndex[1].componentRef!.instance;
    const secondComp: SingleTagTestComponent = comp.hookIndex[2].componentRef!.instance;
    const thirdComp: WhateverTestComponent = comp.hookIndex[3].componentRef!.instance;

    // Make sure components are loaded properly
    expect(Object.keys(comp.hookIndex).length).toBe(3);
    expect(firstComp.constructor.name).toBe('MultiTagTestComponent');
    expect(secondComp.constructor.name).toBe('SingleTagTestComponent');
    expect(thirdComp.constructor.name).toBe('WhateverTestComponent');
    expect(fixture.nativeElement.children[2].innerHTML.trim()).toBe('This should be untouched');

    // Check all inputs
    expect(firstComp.fonts).toEqual(['test', 'something', 'here']);

    expect((secondComp as any)['id']).toBe(undefined);
    expect(secondComp.inputWithoutBrackets).toBe("{test: 'Hullo!'}");
    expect(secondComp.emptyInputWithoutBrackets).toBe('');
    expect(secondComp.emptyInput).toBeUndefined();
    expect(secondComp.emptyStringInput).toBe('');
    expect(secondComp._weird5Input$Name13).toBe('Even names like this should be recognized.');
    expect(secondComp.nonInputProperty).toBe('this is the default value');
    expect(secondComp.stringProp).toBe('this is just a test string');
    expect(secondComp.dataSomeValue).toBe('this is a data value');
    expect(secondComp.numberProp).toBe(846);
    expect(secondComp.booleanProp).toBe(true);
    expect(secondComp.nullProp).toBe(null);
    expect(secondComp.undefinedProp).toBe(undefined);
    expect(secondComp.simpleObject).toEqual({
      config: {
        lightbox: false,
        size: {
          height: '100px',
          width: '200px'
        }
      }
    });
    expect(secondComp.simpleArray).toEqual([1, 2, 'three', true, null, null, [5, 6]]);
    expect(secondComp.variable).toBe('orange');
    expect(secondComp.variableLookalike).toBe('seems like a var, but isnt: [{context.thisShouldntBeRecognizedAsAVariable}]');
    expect(secondComp.variableInObject).toEqual({
      propInObj: 'kashyyyk'
    });
    expect(secondComp.variableInArray).toEqual(['melon', 'there is no try', 798]);
    expect(secondComp.contextWithoutAnything).toEqual(context);
    expect(secondComp.nestedFunctions).toEqual({
      dangerousStr: 'heres a couple of (dangerous) , chars',
      functionsProp: ['Combo: defending Leia! and attacking the evil Wampa!']
    });
    expect(secondComp.nestedFunctionsInBrackets).toEqual([
      'meditating!', 'vigilant'
    ]);
    expect(secondComp.everythingTogether).toEqual([
      'Jar-Jar Binks',
      35,
      {
        someObjProp: [
          true,
          'hello',
          null,
          76,
          '02:46am',
          'Hello there!'
        ]
      }, [
        'another',
        'variable',
        undefined,
        'laststring',
        {
          complexFunctionCall: 'calm'
        }
      ]
    ]);

    expect(thirdComp.nr).toBe(123);
    expect(thirdComp.config).toEqual({name: 'test', supportedValues: [1, 2, 3], active: true});
  });

  it('#should parse outputs properly', () => {
    const testText = `<singletagtest [numberProp]="123" (componentClickedAlias)="context.maneuvers.modifyParent($event)">`;
    comp.content = testText;
    comp.context = context;
    comp.ngOnChanges({content: true, context: true} as any);

    expect((comp as any)['completelyNewProperty']).toBeUndefined();
    comp.hookIndex[1].componentRef!.instance.componentClicked.emit(555);
    expect((comp as any)['completelyNewProperty']).toBe(555);
  });

  it('#should catch errors if output string cannot be evaluated', () => {
    spyOn(console, 'error').and.callThrough();
    const testText = `<singletagtest (componentClickedAlias)="context.maneuvers.modifyParent($event">`; // Missing final bracket
    comp.content = testText;
    comp.context = context;
    comp.ngOnChanges({content: true, context: true} as any);

    expect((comp as any)['completelyNewProperty']).toBeUndefined();
    comp.hookIndex[1].componentRef!.instance.componentClicked.emit(555);
    expect((comp as any)['completelyNewProperty']).toBeUndefined();
    expect((<any>console.error)['calls'].count(1));
  });

  it('#should track all hooks and their bindings with used context variables', () => {
    const testText = `
      <p>Let's test this with two singletag-components</p>
      <singletagtest [simpleObject]="{something: true, contextVar: context.order, nestedArray: [context.$lightSaberCollection]}" [simpleArray]="[true]" (httpResponseReceived)="context.maneuvers.meditate()">
      <singletagtest [numberProp]="567">
      <p>And a multitagcomponent</p>
      <multitagtest [fonts]="['arial', context.greeting]"></multitagtest>
    `;
    comp.content = testText;
    comp.context = context;
    comp.ngOnChanges({content: true, context: true} as any);

    // singletag hooks
    const singleTagBindings = (comp as any).activeParsers[5]['currentBindings'];
    expect(Object.keys(singleTagBindings).length).toBe(2);

    // First singletag:
    expect(Object.keys(singleTagBindings[1].inputs).length).toBe(2);
    expect(singleTagBindings[1].inputs['simpleObject'].raw).toBe('{something: true, contextVar: context.order, nestedArray: [context.$lightSaberCollection]}');
    expect(singleTagBindings[1].inputs['simpleObject'].value).toEqual({something: true, contextVar: context.order, nestedArray: [context.$lightSaberCollection]});
    expect(Object.keys(singleTagBindings[1].inputs['simpleObject'].boundContextVariables).length).toBe(2);
    expect(singleTagBindings[1].inputs['simpleObject'].boundContextVariables['context.order']).toBe(66);
    expect(singleTagBindings[1].inputs['simpleObject'].boundContextVariables['context.$lightSaberCollection']).toEqual(context.$lightSaberCollection);

    expect(singleTagBindings[1].inputs['simpleArray'].raw).toBe('[true]');
    expect(singleTagBindings[1].inputs['simpleArray'].value).toEqual([true]);
    expect(Object.keys(singleTagBindings[1].inputs['simpleArray'].boundContextVariables).length).toBe(0);

    expect(Object.keys(singleTagBindings[1].outputs).length).toBe(1);
    expect(singleTagBindings[1].outputs['httpResponseReceived'].raw).toBe('context.maneuvers.meditate()');
    expect(typeof singleTagBindings[1].outputs['httpResponseReceived'].value).toBe('function');
    expect(Object.keys(singleTagBindings[1].outputs['httpResponseReceived'].boundContextVariables).length).toBe(0);

    // Second singletag:
    expect(Object.keys(singleTagBindings[2].inputs).length).toBe(1);
    expect(singleTagBindings[2].inputs['numberProp'].raw).toBe('567');
    expect(singleTagBindings[2].inputs['numberProp'].value).toBe(567);
    expect(Object.keys(singleTagBindings[2].inputs['numberProp'].boundContextVariables).length).toBe(0);

    // multitag hooks
    const multiTagBindings = (comp as any).activeParsers[6]['currentBindings'];
    expect(Object.keys(multiTagBindings).length).toBe(1);

    // First multitag:
    expect(Object.keys(multiTagBindings[3].inputs).length).toBe(1);
    expect(multiTagBindings[3].inputs['fonts'].raw).toBe(`['arial', context.greeting]`);
    expect(multiTagBindings[3].inputs['fonts'].value).toEqual(['arial', context.greeting]);
    expect(Object.keys(multiTagBindings[3].inputs['fonts'].boundContextVariables).length).toBe(1);
    expect(multiTagBindings[3].inputs['fonts'].boundContextVariables['context.greeting']).toBe(context.greeting);
  });

  it('#should remove bindings that cannot be parsed', () => {
    const testText = `<singletagtest [numberProp]="12345" [simpleObject]="{color: 'blue', speed: 100">`; // <-- object has missing closing tag
    comp.content = testText;
    comp.context = context;
    comp.ngOnChanges({content: true, context: true} as any);

    // simpleObject should not be tracked
    const singleTagBindings = (comp as any).activeParsers[5]['currentBindings'];
    expect(Object.keys(singleTagBindings[1].inputs).length).toBe(1);
    expect(singleTagBindings[1].inputs['numberProp'].value).toBe(12345);
  });

  it('#should preserve binding references on update if binding is static', () => {
    const testText = `<singletagtest [simpleObject]="{something: true, extra: 'hi, this is a string!'}">`;
    comp.content = testText;
    comp.context = context;
    comp.options = {updateOnPushOnly: false};
    comp.ngOnChanges({content: true, context: true, options: true} as any);

    // Check bindings
    const singleTagBindings = (comp as any).activeParsers[5]['currentBindings'];
    expect(Object.keys(singleTagBindings[1].inputs).length).toBe(1);
    expect(singleTagBindings[1].inputs['simpleObject'].raw).toBe("{something: true, extra: 'hi, this is a string!'}");
    expect(singleTagBindings[1].inputs['simpleObject'].value).toEqual({something: true, extra: "hi, this is a string!"});
    expect(Object.keys(singleTagBindings[1].inputs['simpleObject'].boundContextVariables).length).toBe(0);

    spyOn(comp.activeParsers[5], 'getBindings').and.callThrough();
    const previousRef = singleTagBindings[1].inputs['simpleObject'].value;

    // Trigger cd
    comp.ngDoCheck();

    // Parser should preserve binding reference on reevaluation
    expect((comp as any).activeParsers[5].getBindings['calls'].count()).toBe(1);
    expect(singleTagBindings[1].inputs['simpleObject'].value).toBe(previousRef);
  });

  it('#should preserve binding references on update if binding has bound context vars, but they have not changed', () => {
    const testText = `<singletagtest [simpleObject]="{something: context.$lightSaberCollection}">`;
    comp.content = testText;
    comp.context = context;
    comp.options = {updateOnPushOnly: false};
    comp.ngOnChanges({content: true, context: true, options: true} as any);

    // Check bindings
    const singleTagBindings = (comp as any).activeParsers[5]['currentBindings'];
    expect(Object.keys(singleTagBindings[1].inputs).length).toBe(1);
    expect(singleTagBindings[1].inputs['simpleObject'].raw).toBe("{something: context.$lightSaberCollection}");
    expect(singleTagBindings[1].inputs['simpleObject'].value).toEqual({something: context.$lightSaberCollection});
    expect(Object.keys(singleTagBindings[1].inputs['simpleObject'].boundContextVariables).length).toBe(1);
    expect(singleTagBindings[1].inputs['simpleObject'].boundContextVariables['context.$lightSaberCollection']).toBe(context.$lightSaberCollection);

    spyOn(comp.activeParsers[5], 'getBindings').and.callThrough();
    const previousRef = singleTagBindings[1].inputs['simpleObject'].value;

    // Trigger cd
    comp.ngDoCheck();

    // Parser should preserve binding reference on reevaluation
    expect((comp as any).activeParsers[5].getBindings['calls'].count()).toBe(1);
    expect(singleTagBindings[1].inputs['simpleObject'].value).toBe(previousRef);
  });

  it('#should preserve binding references on update if binding has bound context vars, and only their content has changed', () => {
    const testText = `<singletagtest [simpleObject]="{something: context.$lightSaberCollection}">`;
    comp.content = testText;
    comp.context = context;
    comp.options = {updateOnPushOnly: false};
    comp.ngOnChanges({content: true, context: true, options: true} as any);

    // Check bindings
    const singleTagBindings = (comp as any).activeParsers[5]['currentBindings'];
    expect(Object.keys(singleTagBindings[1].inputs).length).toBe(1);
    expect(singleTagBindings[1].inputs['simpleObject'].raw).toBe("{something: context.$lightSaberCollection}");
    expect(singleTagBindings[1].inputs['simpleObject'].value).toEqual({something: context.$lightSaberCollection});
    expect(Object.keys(singleTagBindings[1].inputs['simpleObject'].boundContextVariables).length).toBe(1);
    expect(singleTagBindings[1].inputs['simpleObject'].boundContextVariables['context.$lightSaberCollection']).toBe(context.$lightSaberCollection);

    spyOn(comp.activeParsers[5], 'getBindings').and.callThrough();
    const previousRef = singleTagBindings[1].inputs['simpleObject'].value;

    // Change content and trigger cd
    context.$lightSaberCollection.push('cyan');
    comp.ngDoCheck();

    // Parser should preserve binding reference on reevaluation
    expect((comp as any).activeParsers[5].getBindings['calls'].count()).toBe(1);
    expect(singleTagBindings[1].inputs['simpleObject'].value).toBe(previousRef);
  });

  it('#should change binding references on update if binding has bound context vars and they have changed', () => {
    const testText = `<singletagtest [simpleArray]="[context.order]" [simpleObject]="{something: context.$lightSaberCollection}" (httpResponseReceived)="content.maneuvers.getMentalState()">`;
    comp.content = testText;
    comp.context = context;
    comp.options = {updateOnPushOnly: false};
    comp.ngOnChanges({content: true, context: true, options: true} as any);

    // Check bindings
    const singleTagBindings = (comp as any).activeParsers[5]['currentBindings'];
    expect(Object.keys(singleTagBindings[1].inputs).length).toBe(2);

    expect(singleTagBindings[1].inputs['simpleArray'].raw).toBe("[context.order]");
    expect(singleTagBindings[1].inputs['simpleArray'].value).toEqual([context.order]);
    expect(Object.keys(singleTagBindings[1].inputs['simpleArray'].boundContextVariables).length).toBe(1);
    expect(singleTagBindings[1].inputs['simpleArray'].boundContextVariables['context.order']).toBe(context.order);

    expect(singleTagBindings[1].inputs['simpleObject'].raw).toBe("{something: context.$lightSaberCollection}");
    expect(singleTagBindings[1].inputs['simpleObject'].value).toEqual({something: context.$lightSaberCollection});
    expect(Object.keys(singleTagBindings[1].inputs['simpleObject'].boundContextVariables).length).toBe(1);
    expect(singleTagBindings[1].inputs['simpleObject'].boundContextVariables['context.$lightSaberCollection']).toBe(context.$lightSaberCollection);

    expect(singleTagBindings[1].outputs['httpResponseReceived'].raw).toBe('content.maneuvers.getMentalState()');
    expect(typeof singleTagBindings[1].outputs['httpResponseReceived'].value).toBe('function');
    expect(Object.keys(singleTagBindings[1].outputs['httpResponseReceived'].boundContextVariables).length).toBe(0); // Can't be known until the event triggers

    spyOn(comp.activeParsers[5], 'getBindings').and.callThrough();

    // Change bound property and trigger cd
    let previousArrayRef = singleTagBindings[1].inputs['simpleArray'].value;
    let previousObjectRef = singleTagBindings[1].inputs['simpleObject'].value;
    let previousOutputRef = singleTagBindings[1].outputs['httpResponseReceived'].value;
    context.order = 77;
    context.$lightSaberCollection = ['cyan', 'viridian', 'turquoise'];
    context.maneuvers.getMentalState = () => 'happy';
    comp.ngDoCheck();

    // Parser should have changed binding reference on reevaluation
    expect((comp as any).activeParsers[5].getBindings['calls'].count()).toBe(1);
    expect(singleTagBindings[1].inputs['simpleArray'].value).not.toBe(previousArrayRef);
    expect(singleTagBindings[1].inputs['simpleObject'].value).not.toBe(previousObjectRef);
    expect(singleTagBindings[1].outputs['httpResponseReceived'].value).toBe(previousOutputRef); // Output wrapper func refs should never change

    // Test identical by value:
    // If object, binding reference should change even if new context prop is identical by value, as the reference is still different.
    // If primitive, binding reference should not change if identical as they are not compared by reference.
    previousArrayRef = singleTagBindings[1].inputs['simpleArray'].value;
    previousObjectRef = singleTagBindings[1].inputs['simpleObject'].value;
    context.order = 77;
    context.$lightSaberCollection = ['cyan', 'viridian', 'turquoise'];
    comp.ngDoCheck();
    expect((comp as any).activeParsers[5].getBindings['calls'].count()).toBe(2);
    expect(singleTagBindings[1].inputs['simpleArray'].value).toBe(previousArrayRef);
    expect(singleTagBindings[1].inputs['simpleObject'].value).not.toBe(previousObjectRef);
  });

  it('#should replace (currently) invalid context vars with undefined, but fix them when they become available', () => {
    const testText = `<singletagtest [simpleObject]='{validContextVar: context._jediCouncil.kenobi, invalidContextVar: context.sithTriumvirate.kreia}'>`;
    comp.content = testText;
    comp.context = context;
    comp.options = {updateOnPushOnly: false};
    comp.ngOnChanges({content: true, context: true, options: true} as any);

    // One of them should be undefined
    const loadedComp = comp.hookIndex[1].componentRef!.instance;
    expect(loadedComp.simpleObject).toEqual({validContextVar: context._jediCouncil.kenobi, invalidContextVar: undefined});

    // Should automatically fix itself when context var becomes available
    spyOn(loadedComp, 'ngOnChanges').and.callThrough();
    comp.context['sithTriumvirate'] = {kreia: 'you are blind'};
    comp.ngDoCheck();
    expect(loadedComp.ngOnChanges['calls'].count()).toBe(1);
    expect(Object.keys(loadedComp.ngOnChanges['calls'].mostRecent().args[0]).length).toBe(1);
    expect(loadedComp.ngOnChanges['calls'].mostRecent().args[0]['simpleObject']).toBeDefined();
    expect(loadedComp.simpleObject).toEqual({validContextVar: context._jediCouncil.kenobi, invalidContextVar: 'you are blind'});
  });
});
